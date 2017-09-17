import * as pug from 'pug';

export default function (){
  let codeexports = 'module.exports = ';
  let html        =  pug.renderFile('./src/synopsis.pug');
  // let html        =  pug.render("h1 FUCK YOU BITCH'! ");
      html        =  html.replace(/'/g,"\\'").replace(/\s/g,' ');
  return Promise.resolve({
      code      : codeexports+'\''+html+'\';'
    , cacheable : false
  })
}

