function handleMenu(isOpen) {
    const overlay = document.getElementById('menuOverlay');
    const openIcon = document.getElementById('openIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (isOpen) {
        overlay.classList.add('is-open');
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    } else {
        overlay.classList.remove('is-open');
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }
}

function handleAccordion(element) {
    const parent = element.parentElement;
    const allGroups = document.querySelectorAll('.menu-group');

    allGroups.forEach(group => {
        if (group === parent) {
            group.classList.toggle('is-active');
        } else {
            group.classList.remove('is-active');
        }
    });
}