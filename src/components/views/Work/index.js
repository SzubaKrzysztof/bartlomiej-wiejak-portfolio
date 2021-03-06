import React, { useEffect, useContext, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import gsap from 'gsap';

import { showInterface } from '../../../animations/interface';
import { LoadingContext, RoutingContext } from '../../../context';
import Project from './Project';
import { hideInterface } from '../../../animations/interface';
import { cursorMultiDot } from '../../../animations/cursor';
import WorkPagination from './WorkPagination';
import Circle from './Circle';
import CustomEase from 'gsap/CustomEase';
import { cursorBackToNormal, cursorHide } from '../../../animations/cursor';
import { toLight } from '../../../functions/handleBackground';

gsap.registerPlugin(CustomEase)
CustomEase.create('custom', 'M0,0 C0,0 0.094,0.019 0.174,0.058 0.231,0.085 0.24,0.088 0.318,0.15 0.426,0.25 0.627,0.701 0.718,0.836 0.819,0.985 1,1 1,1 ')

const Work = () => {
  const { loadingState } = useContext(LoadingContext);
  const { routingState, dispatch } = useContext(RoutingContext)
  const history = useHistory();

  const canScrollRef = useRef(true);
  const scrollIntervalRef = useRef(null);
  const currentProjectIndexRef = useRef(0);
  const initialYRef = useRef(0);
  const initialMouseClientYRef = useRef(0);
  const projectsRef = useRef(null);
  const isMountedRef = useRef(false)

  if (routingState.lastProject !== null && !routingState.animating && !isMountedRef.current) {
    currentProjectIndexRef.current = routingState.lastProject;
  }

  useEffect(() => {
    projectsRef.current = document.querySelectorAll('.view .project')
  }, [])

  useEffect(() => {
    if (routingState.currentScrollIndex === null) {
      dispatch({ type: 'SET_CURRENT_SCROLL_INDEX', payload: 0 });
    }
  }, [routingState.currentScrollIndex, dispatch])

  const slideHandle = useCallback((direction) => {
    if (direction === 1) {
      const isLastProject = currentProjectIndexRef.current === projectsRef.current.length - 1;
      if (isLastProject) return;
    }
    if (direction === -1) {
      const firstProject = currentProjectIndexRef.current === 0;
      if (firstProject) return;
    }
    canScrollRef.current = false;
    let circleRotation;
    switch (currentProjectIndexRef.current + direction) {
      case 0:
        circleRotation = '90deg';
        break;
      case 1:
        circleRotation = '185deg';
        break;
      case 2:
        circleRotation = '269deg'
        break;
      case 3:
        circleRotation = '357deg'
        break;
      default:
        circleRotation = '90deg';
    }
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      gsap.to('.circle', 1, { rotate: circleRotation, delay: .3, ease: 'custom' })
      clearInterval(scrollIntervalRef.current)
      gsap.to('.work__indicator__text, .work__indicator__line', 1, { y: '100%', autoAlpha: 0, ease: 'custom' })
      if (direction > 0) {
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 1}) .project__title div`], 1.2, { y: '0%' }, { y: '-100%', ease: 'power2.out' })
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current + 1].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 2}) .project__title div`], 1.2, { y: '100%' }, { y: '0%', onComplete: () => canScrollRef.current = true, ease: 'power2.out' })
      }
      if (direction < 0) {
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 1}) .project__title div`], 1.2, { y: '0%' }, { y: '100%', ease: 'power2.out' })
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current - 1].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current}) .project__title div`], 1.2, { y: '-100%' }, { y: '0%', onComplete: () => canScrollRef.current = true, ease: 'power2.out' })
      }
    } else {
      gsap.to('.circle', 1, { rotate: circleRotation, delay: .3, ease: 'custom' })
      clearInterval(scrollIntervalRef.current)
      gsap.to('.work__indicator__text, .work__indicator__line', 1, { y: '100%', autoAlpha: 0, ease: 'custom' })
      if (direction > 0) {
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 1}) .project__title div`], 1.2, { transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-100%,0)', ease: 'power2.out' })
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current + 1].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 2}) .project__title div`], 1.2, { transform: 'translate3d(0,100%,0)' }, { transform: 'translate3d(0,0,0)', delay: .9, onComplete: () => canScrollRef.current = true, ease: 'power2.out' })
      }
      if (direction < 0) {
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current + 1}) .project__title div`], 1.2, { transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,100%,0)', ease: 'power2.out' })
        gsap.fromTo([projectsRef.current[currentProjectIndexRef.current - 1].querySelectorAll('.project__title div'), `.work--fill .project:nth-child(${currentProjectIndexRef.current}) .project__title div`], 1.2, { transform: 'translate3d(0,-100%,0)' }, { transform: 'translate3d(0,0,0)', delay: .9, onComplete: () => canScrollRef.current = true, ease: 'power2.out' })
      }
    }
    setTimeout(() => {
      currentProjectIndexRef.current += direction;
      dispatch({ type: 'SET_CURRENT_SCROLL_INDEX', payload: currentProjectIndexRef.current })
      gsap.to('.work__pagination__active', 1, { y: `${-34 * (currentProjectIndexRef.current)}px` })
      const scrollValue = -currentProjectIndexRef.current * (100 / projectsRef.current.length);
      if (navigator.userAgent.indexOf("Firefox") > -1) {
        gsap.fromTo('.work__scroller', .9, { y: `${-(currentProjectIndexRef.current - direction) * (100 / projectsRef.current.length)}%` }, { y: `${scrollValue}%`, transform: 'translate(0,0)', ease: 'custom' })
      } else {
        gsap.to('.work__scroller', .9, { transform: `translate3d(0,${scrollValue}%,0)`, ease: 'custom' })
      }
    }, 300)
  }, [dispatch])

  const slider = useCallback((event) => {
    if (!canScrollRef.current) return;
    const direction = event.deltaY < 0 ? -1 : 1;

    slideHandle(direction)
  }, [slideHandle])

  const swipeListen = useCallback((event) => {
    if (!canScrollRef.current) return;
    const currentY = event.touches[0].clientY;
    if (Math.abs(currentY - initialYRef.current) < 100) return;
    const direction = initialYRef.current - currentY > 0 ? 1 : -1;
    document.removeEventListener('touchmove', swipeListen)
    slideHandle(direction)
  }, [slideHandle])

  const swiper = useCallback((event) => {
    if (!canScrollRef.current) return;
    initialYRef.current = event.touches[0].clientY;
    document.addEventListener('touchmove', swipeListen)
  }, [swipeListen])

  const swipeMouseListen = useCallback((event) => {
    if (!canScrollRef.current) return;
    const currentY = event.clientY;
    if (Math.abs(currentY - initialMouseClientYRef.current) < 200) return;
    const direction = initialMouseClientYRef.current - currentY > 0 ? 1 : -1;
    document.removeEventListener('mousemove', swipeMouseListen)
    slideHandle(direction)
  }, [slideHandle])

  const swiperMouse = useCallback((event) => {
    if (!canScrollRef.current) return;
    initialMouseClientYRef.current = event.clientY;
    document.addEventListener('mousemove', swipeMouseListen)
  }, [swipeMouseListen])

  const removeListeners = useCallback(() => {
    document.removeEventListener('wheel', slider)
    document.removeEventListener('touchstart', swiper)
    document.removeEventListener('touchmove', swipeListen)
    document.removeEventListener('mousedown', cursorMultiDot)
    document.removeEventListener('mousedown', swiperMouse)
    document.removeEventListener('mousemove', swipeMouseListen)
    clearInterval(scrollIntervalRef.current);

    gsap.to('.work__indicator__text, .work__indicator__line', 1, { y: '100%', autoAlpha: 0, ease: 'custom' })
  }, [slider, swiper, swipeListen, swiperMouse, swipeMouseListen])

  const addListeners = useCallback(() => {
    document.addEventListener('wheel', slider)
    document.addEventListener('touchstart', swiper)
    document.addEventListener('mousedown', cursorMultiDot)
    document.addEventListener('mousedown', swiperMouse)
    document.addEventListener('mouseup', () => document.removeEventListener('mousemove', swipeMouseListen))
    document.addEventListener('touchend', () => document.removeEventListener('touchmove', swipeListen))
  }, [slider, swiper, swipeListen, swiperMouse, swipeMouseListen])

  useEffect(() => {
    if (routingState.animating && (routingState.path === '/' || routingState.path === '/about')) {
      removeListeners();
      gsap.set('.project__title div', { y: 0 })
      gsap.to('.work__pagination__active', currentProjectIndexRef.current * .4, { y: 0, ease: 'custom' })
      gsap.to('.project .button', 1, { y: '100%', ease: 'power2.out' })
      hideInterface();
      cursorHide()
      gsap.to('.circle', currentProjectIndexRef.current * .4, { rotate: '90deg', ease: 'custom' })
      dispatch({ type: 'SET_CURRENT_SCROLL_INDEX', payload: 0 });
      gsap.to('.work__scroller', currentProjectIndexRef.current * .4, {
        transform: 'translate3d(0,0%,0)', ease: 'custom', onComplete: () => {
          setTimeout(() => {
            gsap.to('.circle', .5, { y: '100%', x: '100%', ease: 'power2.out' })
            gsap.to('.work__pagination > div', .5, { y: '100%', ease: 'power2.out' })
            setTimeout(() => {
              gsap.to('.project__title--down', 1, { x: '300%', ease: 'power2.out' })
              gsap.to('.project__title--up', 1, {
                x: '-300%', ease: 'power2.out', onComplete: () => {
                  dispatch({ type: 'SET_ANIMATING', payload: false })
                  history.push(routingState.path)
                }
              })
            }, 1000)
          }, 200)
        }
      })
    }
  }, [routingState.animating, routingState.path, slider, history, removeListeners, dispatch])

  useEffect(() => {
    let timeout;
    let timeoutListeners;

    if (loadingState.isLoaded && routingState.lastProject === null && !isMountedRef.current) {
      const time = toLight(1000) + 3000;

      timeout = setTimeout(() => {
        showInterface();
        cursorBackToNormal()
        gsap.to('.circle', 1, { y: '50%', x: '50%' })
        gsap.to('.project__title div, .work__pagination > div', 1, { y: 0 })
        gsap.to('.project .button', 1, {
          y: 0
        })
        gsap.to('.work__indicator__text', 1.5, { y: '0%', autoAlpha: 1, ease: 'power4.out' })

        gsap.fromTo('.work__indicator__line', .5, { y: '-100%' }, { y: '0%', ease: 'custom' })
        gsap.fromTo('.work__indicator__line', .5, { y: '0%' }, { y: '100%', ease: 'custom', delay: 1 })
        scrollIntervalRef.current = setInterval(() => {
          gsap.fromTo('.work__indicator__line', .5, { y: '-100%' }, { y: '0%', ease: 'custom' })
          gsap.fromTo('.work__indicator__line', .5, { y: '0%' }, { y: '100%', ease: 'custom', delay: 1 })
        }, 2000)

        timeoutListeners = setTimeout(addListeners, 1000)
      }, time)

    }
    return () => {
      clearTimeout(timeout)
      clearTimeout(timeoutListeners)
      clearInterval(scrollIntervalRef.current)
    }
  }, [loadingState.isLoaded, slider, swiper, swipeListen, removeListeners, routingState.lastProject, addListeners])
  useEffect(() => {
    if (routingState.lastProject !== null) {
      cursorBackToNormal()
      showInterface();
      let circleRotation;
      switch (routingState.lastProject) {
        case 0:
          circleRotation = '90deg';
          break;
        case 1:
          circleRotation = '185deg';
          break;
        case 2:
          circleRotation = '269deg'
          break;
        case 3:
          circleRotation = '357deg'
          break;
        default:
          circleRotation = '90deg';
      }
      gsap.to('.circle', 1, { y: '50%', x: '50%', rotate: circleRotation })
      gsap.to('.work__pagination > div', 1, { y: 0 })
      gsap.set('.work__pagination__active', { y: -routingState.lastProject * 34 })
      gsap.to('.project .button', 1, {
        y: 0, onComplete: () => {
          dispatch({ type: 'SET_LAST_PROJECT', payload: null })
          isMountedRef.current = true;
          addListeners();
        }
      })
    }
  }, [routingState.lastProject, slider, swipeListen, swiper, addListeners, dispatch])

  useEffect(() => {
    let timeout;

    const onResize = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = null;
        const scrollValue = -currentProjectIndexRef.current * (100 / projectsRef.current.length);
        if (navigator.userAgent.indexOf("Firefox") > -1) {
          gsap.to('.work__scroller', .5, { y: `${scrollValue}%`, ease: 'custom' })
        } else {
          gsap.to('.work__scroller', .5, { transform: `translate3d(0,${scrollValue}%,0)`, ease: 'custom' })
        }
      }, 500)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])
  const styleRef = useRef({})
  if (routingState.lastProject !== null) {
    styleRef.current = { transform: `translate3d(0,-${routingState.lastProject * 25}%,0)` }
  }
  return (
    <div className='work'>
      <div className='work__scroller' style={styleRef.current}>
        {ReactDOM.createPortal(<WorkPagination />, document.getElementById('root'))}
        {ReactDOM.createPortal(<Circle />, document.getElementById('root'))}
        <Project projectIndex={0} titleUp='Cloth' titleDown='Vault' url='/work/vault-clothing' removeListeners={removeListeners} />
        <Project projectIndex={1} titleUp='Place' titleDown='Your' url='/work/places-app' removeListeners={removeListeners} />
        <Project projectIndex={2} titleUp='Project' titleDown='Burger' url='/work/burger-project' removeListeners={removeListeners} />
        <Project projectIndex={3} titleUp='Soon' titleDown='Coming' url='/work' inactive={true} />
      </div>
      <div className="work__indicator">
        <span className='work__indicator__text-container'><span className='work__indicator__text'>Swipe to explore</span></span>
        <div className='work__indicator__line-container'>
          <div className='work__indicator__line' />
        </div>
      </div>
    </div>
  );
}

export default Work;