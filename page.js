(() => {
    'use strict';
    if (window.lucide) window.lucide.createIcons();
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const href=anchor.getAttribute('href');
            const target=href==='#' ? document.body : document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            if (anchor.dataset.challenge) {
                const message=document.querySelector('#enquiry-message');
                if (!message.value.trim()) message.value=anchor.dataset.challenge;
            }
            target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
        });
    });
    // Keep the navigation connected to the reader's current part of the page.
    const sections=[...document.querySelectorAll('#services,#work,#approach,#contact')];
    const navLinks=[...document.querySelectorAll('.nav-links a')];
    let navigationFrame=0;
    function updateNavigation() {
        navigationFrame=0;
        const threshold=document.querySelector('nav').offsetHeight+70;
        const current=sections.filter(section=>section.getBoundingClientRect().top<=threshold).pop();
        navLinks.forEach(link=>{
            if (current && link.getAttribute('href')==='#'+current.id) link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
        });
    }
    window.addEventListener('scroll',()=>{
        if (!navigationFrame) navigationFrame=requestAnimationFrame(updateNavigation);
    },{passive:true});
    window.addEventListener('resize',updateNavigation);
    updateNavigation();
    document.querySelectorAll('.challenge').forEach(details=>{
        details.addEventListener('toggle',()=>{
            if (details.open) document.querySelectorAll('.challenge').forEach(other=>{
                if (other!==details) other.open=false;
            });
            updateNavigation();
        });
    });
    const form=document.querySelector('.enquiry-form');
    form.addEventListener('submit',async event => {
        event.preventDefault();
        const button=form.querySelector('button');
        const status=form.querySelector('.form-status');
        button.disabled=true; button.textContent='Sending…'; status.textContent='';
        try {
            const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
            if (!response.ok) throw new Error('Unable to send enquiry');
            form.reset();
            status.textContent='Thank you. We have received your enquiry and will reply using the email you provided.';
        } catch {
            status.textContent='We could not send your enquiry. Your message is saved in this form; please try again.';
        } finally {
            button.disabled=false; button.textContent='Send enquiry';
        }
    });
})();
