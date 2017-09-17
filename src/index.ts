declare const $: any
declare global  {
  interface Location {tempHash: string }
}

console.log(`
Made by Davronov Alexander.
Contact me via: al.neodim@gmail.com
Source code can be found at http://github.com/hinell/git-book
`);

import './styles.scss'
let synopsis = require('val-loader!./synopsis.ts');

window.addEventListener('load', function (){

      // Edge bug workaround
      document.body.style['line-height'] = document.body.style['line-height'];
  //    performance.mark('syninsrt-start')
  let article:any = document.body.getElementsByTagName('article')[0];
      article.content = document.createDocumentFragment();
      typeof article.insertAdjacentHTML === 'undefined'
        ? article.insertAdjacentHTML("beforeend", synopsis)
        : article.innerHTML = synopsis;

  //    performance.mark('syninsrt-end')
  //    performance.measure('synopsis-load','syninsrt-start','syninsrt-end')
  //let synopsisperf = performance.getEntriesByName('synopsis-load')[0];
  //    console.log('Synopsis render has taken: ',synopsisperf.duration);

  let headers = [].slice.call((document.body.getElementsByTagName('article')[0]).getElementsByTagName('h1'));

      headers = headers.map(function (header){
        header.originalText = header.textContent;
        header.id = header.textContent
          .trim()
          .replace(/\./g,'')
          .replace(/\t/,'')
          .replace(/\s+/g,'')
        return header
      });

  let anchors = headers.map(function (header: HTMLHeadElement){
      let anchor = document.createElement('a');
          anchor.textContent  = '#';
          anchor.className    = 'anchor';
          anchor.href         = '#'+header.id;
          header.insertAdjacentElement('afterbegin',anchor)
          return anchor
      });
      
      
  let contenttitle = document.createElement('h3');
      contenttitle.textContent = 'CONTENT' //<h>CONTENT<h>
  
  let contenttable = document.body.getElementsByTagName('aside')[0];
      // contenttable.className = 'content-table';
      contenttable.appendChild(contenttitle);
  
  // let location = window.location;
      headers.forEach(function (header){
        interface ContentHeader extends HTMLAnchorElement { original: ContentHeader };
        let contentheader = <ContentHeader> document.createElement('a');
            contentheader.textContent    = header.originalText;
            contentheader.original       = header;
            contentheader.setAttribute('class','h2')
            contentheader.href = '#'+header.id
            //contentheader.addEventListener('click',e => e.target.original.scrollIntoView())
            contentheader.addEventListener('click',function (e){
                
                let headertarget: ContentHeader = (e.target as ContentHeader).original;
                e.preventDefault();
                headertarget.scrollIntoView({behavior: 'smooth', block: 'start'})
                // location.tempHash = headertarget.id;
                // if we don't postpone hash change the page scrolled to quickly
                // setTimeout( foo => (console.log('HASH CHANGED'),location.hash = location.tempHash), 1500);
            })
            contenttable.appendChild(contentheader)
      })
})
