const highlight = Array.from(document.body.querySelectorAll('p, div, li, span'))
  .filter((el): el is HTMLElement => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && 
           el.textContent?.trim() !== '' && 
           (style.display === 'block' || style.display === 'list-item');
  });