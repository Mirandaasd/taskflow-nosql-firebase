import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const $ = id => document.getElementById(id);
const state = { user: null, tasks: [], filter: 'all', priority: 'all', search: '', editing: null, unsub: null, register: false };
$('today').textContent = new Intl.DateTimeFormat('es-PE', { weekday:'long', month:'long', day:'numeric' }).format(new Date());
let auth, database;
const configured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('REEMPLAZAR') && firebaseConfig.projectId !== 'REEMPLAZAR_PROJECT_ID';
if (!configured) $('config-warning').classList.remove('hidden');
else {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app); database = getFirestore(app);
    onAuthStateChanged(auth, changeUser, error => message('auth-feedback', describe(error)));
  } catch (error) { $('config-warning').textContent = describe(error); $('config-warning').classList.remove('hidden'); }
}
function message(id, text='') { $(id).textContent=text; }
function describe(error) {
  const hints = {'auth/email-already-in-use':'El correo ya esta registrado.', 'auth/invalid-credential':'Correo o contrasena incorrectos.', 'auth/weak-password':'Usa al menos 6 caracteres.', 'auth/operation-not-allowed':'Activa Correo/Contrasena en Firebase Authentication.', 'permission-denied':'Permiso denegado. Revisa las reglas de Firestore.'};
  return hints[error?.code] || error?.message || 'Ocurrio un error.';
}
function changeUser(user) {
  state.unsub?.(); state.unsub=null; state.user=user; state.tasks=[];
  $('auth-section').classList.toggle('hidden', Boolean(user));
  $('dashboard').classList.toggle('hidden', !user);
  $('signout').classList.toggle('hidden', !user);
  $('user-email').textContent=user?.email || '';
  if (!user) return;
  state.unsub=onSnapshot(query(collection(database,'tasks'),where('userId','==',user.uid)), snapshot => {
    state.tasks=snapshot.docs.map(record=>({id:record.id,...record.data()}));
    render(); message('tasks-feedback');
  }, error=>message('tasks-feedback', describe(error)));
}
$('auth-form').addEventListener('submit', async event=>{
  event.preventDefault(); if (!auth) return;
  $('auth-submit').disabled=true; message('auth-feedback');
  try {
    const email=$('email').value.trim(), password=$('password').value;
    if (state.register) await createUserWithEmailAndPassword(auth,email,password);
    else await signInWithEmailAndPassword(auth,email,password);
    $('auth-form').reset();
  } catch(error) { message('auth-feedback', describe(error)); }
  finally { $('auth-submit').disabled=false; }
});
$('toggle-auth').addEventListener('click',()=>{
  state.register=!state.register;
  $('auth-heading').textContent=state.register?'Crear cuenta':'Iniciar sesion';
  $('auth-submit').textContent=state.register?'Registrarme':'Iniciar sesion';
  $('toggle-auth').textContent=state.register?'Ya tengo cuenta: iniciar sesion':'¿No tienes cuenta? Registrate';
  message('auth-feedback');
});
$('signout').addEventListener('click',async()=>{try {await signOut(auth);} catch(error){message('tasks-feedback',describe(error));}});
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  state.filter=btn.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(other=>other.classList.toggle('active',other===btn)); render();
}));
$('priority-filter').addEventListener('change',event=>{state.priority=event.target.value;render();});
$('search').addEventListener('input',event=>{state.search=event.target.value.trim().toLowerCase();render();});
function render() {
  const completed=state.tasks.filter(task=>task.completed).length;
  for (const [id,value] of Object.entries({'stat-total':state.tasks.length,'stat-pending':state.tasks.length-completed,'stat-completed':completed,'n-all':state.tasks.length,'n-pending':state.tasks.length-completed,'n-completed':completed})) $(id).textContent=value;
  const visible=state.tasks.filter(task=>{
    if (state.filter==='pending' && task.completed) return false;
    if (state.filter==='completed' && !task.completed) return false;
    if (state.priority!=='all' && task.priority!==state.priority) return false;
    return (task.title+' '+(task.description||'')).toLowerCase().includes(state.search);
  }).sort((a,b)=>(b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0));
  $('task-list').replaceChildren(); $('empty').classList.toggle('hidden',visible.length>0);
  for (const task of visible) {
    const article=document.createElement('article'); article.className='task'+(task.completed?' done':'');
    const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=Boolean(task.completed);checkbox.setAttribute('aria-label','Completar '+task.title);
    checkbox.addEventListener('change',async()=>{
      checkbox.disabled=true;
      try {await updateDoc(doc(database,'tasks',task.id),{completed:checkbox.checked,updatedAt:serverTimestamp()});}
      catch(error){checkbox.checked=!checkbox.checked;message('tasks-feedback',describe(error));}
      finally{checkbox.disabled=false;}
    });
    const copy=document.createElement('div');copy.className='task-text';
    const h=document.createElement('h3');h.textContent=task.title;
    const p=document.createElement('p');p.textContent=task.description||'Sin descripcion';
    const label=document.createElement('span');label.className='tag '+(task.priority||'medium');label.textContent=({low:'Baja',medium:'Media',high:'Alta'})[task.priority]||'Media';
    const date=document.createElement('small');date.textContent=task.createdAt?.toDate?.().toLocaleDateString('es-PE')||'Reciente';
    copy.append(h,p,label,date);
    const actions=document.createElement('div');actions.className='task-actions';
    const edit=document.createElement('button');edit.type='button';edit.textContent='✎';edit.title='Editar';edit.setAttribute('aria-label','Editar '+task.title);edit.addEventListener('click',()=>showDialog(task));
    const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.title='Eliminar';remove.setAttribute('aria-label','Eliminar '+task.title);
    remove.addEventListener('click',async()=>{
      if (!confirm('¿Eliminar la tarea "'+task.title+'"?')) return;
      remove.disabled=true;
      try{await deleteDoc(doc(database,'tasks',task.id));}
      catch(error){message('tasks-feedback',describe(error));remove.disabled=false;}
    });
    actions.append(edit,remove);article.append(checkbox,copy,actions);$('task-list').append(article);
  }
}
function showDialog(task=null){
  state.editing=task?.id||null;
  $('dialog-title').textContent=task?'Editar tarea':'Nueva tarea';
  $('task-title').value=task?.title||'';$('task-description').value=task?.description||'';$('task-priority').value=task?.priority||'medium';
  $('task-dialog').showModal();$('task-title').focus();
}
$('new-task').addEventListener('click',()=>showDialog());
$('close-dialog').addEventListener('click',()=>$('task-dialog').close());
$('cancel-dialog').addEventListener('click',()=>$('task-dialog').close());
$('task-dialog').addEventListener('close',()=>{state.editing=null;});
$('task-form').addEventListener('submit',async event=>{
  event.preventDefault(); if (!state.user) return;
  const title=$('task-title').value.trim(),description=$('task-description').value.trim(),priority=$('task-priority').value;
  if (!title || title.length>100 || description.length>500 || !['low','medium','high'].includes(priority)) return;
  $('save-task').disabled=true;message('tasks-feedback');
  try {
    const fields={title,description,priority,updatedAt:serverTimestamp()};
    if (state.editing) await updateDoc(doc(database,'tasks',state.editing),fields);
    else await addDoc(collection(database,'tasks'),{...fields,completed:false,userId:state.user.uid,createdAt:serverTimestamp()});
    $('task-dialog').close();
  } catch(error) {message('tasks-feedback',describe(error));}
  finally {$('save-task').disabled=false;}
});
