
(()=>{const p=(location.pathname.split('/').pop()||'index.html');
document.querySelectorAll('.menu a').forEach(a=>{
if(a.getAttribute('href')===p)a.classList.add('active');
});})();
