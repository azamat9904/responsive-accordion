"use strict"

const accordionsList = document.querySelectorAll('[data-accordions]');

const commonAccordionsList = Array.from(accordionsList).filter((accordions) => {
    return !accordions.dataset.accordions.split(',')[0];
})

if(!!commonAccordionsList.length){
    initAccordions(commonAccordionsList, true)
}

const mediaAccordionsList = Array.from(accordionsList).filter((accordions) => {
    return !!accordions.dataset.accordions.split(',')[0]
});

if(!!mediaAccordionsList.length){
    const set = new Set();

    mediaAccordionsList.forEach((mediaAccordions) => {
        const [breakpoint, mediaType] = getAccordionsDataset(mediaAccordions)
        const mediaQuery = `(${mediaType}-width:${breakpoint}px) ${breakpoint} ${mediaType}`;
        set.add(mediaQuery)
    })

    Array.from(set).forEach((mediaStr) => {
        const splitData = mediaStr.split(' ');
        const mediaQuery = splitData[0];
        const breakpoint = splitData[1];
        const mediaType = splitData[2];
        const accordionsCorrespondedToMedia = mediaAccordionsList.filter((mediaAccordions) => {
           const [mediaAccordionsBreakpoint, mediaAccordionsType] = getAccordionsDataset(mediaAccordions)
            return breakpoint === mediaAccordionsBreakpoint && mediaType === mediaAccordionsType;
        })
        const mediaInstance = window.matchMedia(mediaQuery);
        mediaInstance.addEventListener('change', () => {
            initAccordions(accordionsCorrespondedToMedia, mediaInstance.matches)
        })
        initAccordions(accordionsCorrespondedToMedia, mediaInstance.matches)
    })
}

function getAccordionsDataset(accordions){
    const splitData = accordions.dataset.accordions.split(',')
    const breakpoint = splitData[0];
    const mediaType = splitData[1].trim() || 'min';
    return [breakpoint, mediaType]
}

function initAccordions(accordionsList, isAccordion){
    accordionsList.forEach((accordions) => {
        if(isAccordion){
            accordions.classList.add('__init');
            initAccordionsContent(accordions, false)
        }else{
            accordions.classList.remove('__init');
            initAccordionsContent(accordions, true)
        }
    })
}

function initAccordionsContent(accordionsBlock, showAccordionContent){
    const accordionControls = accordionsBlock.querySelectorAll('[data-controls]');
    accordionControls.forEach((accordionControl) => {
        if(!showAccordionContent){
            accordionControl.removeAttribute('tabindex')
            if(!accordionControl.classList.contains('_active')) {
                accordionControl.nextElementSibling.hidden = true;
            }
            accordionControl.addEventListener('click', handleAccordionControlClick)
        }else{
            accordionControl.nextSibling.hidden = false;
            accordionControl.setAttribute('tabindex', -1);
            accordionControl.removeEventListener('click', handleAccordionControlClick)
        }
    })
}

function handleAccordionControlClick(e){
    const el = e.target;
    const accordionsBlock = el.closest('[data-accordions]');
    const onlyOneAccordionShouldBeOpened = accordionsBlock.hasAttribute('data-one-accordion');
    if(!accordionsBlock.querySelector('._slide')){
       if(onlyOneAccordionShouldBeOpened){
           const activeElements = accordionsBlock.querySelectorAll('._active');
           activeElements.forEach((activeElement) => {
               if(activeElement !== el){
                   activeElement.classList.remove('_active');
                   _slideUp(activeElement.nextElementSibling, 500);
               }
           })
       }
        el.classList.toggle('_active');
        _slideToggle(el.nextElementSibling, 500)
    }
}

let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.classList.remove('_slide');
        }, duration);
    }
}

let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}

