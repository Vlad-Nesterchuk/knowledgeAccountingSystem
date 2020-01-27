
window.onload = () => {
  if ( window.location.hash.replace('#','') != '' ) {
    showContent( true ); 
    renderDirectory( window.location.hash.replace('#',''));
  }
  else {
    showContent( false );
  }
}

window.addEventListener ( 'hashchange', () => { 
    showContent(window.location.hash.replace('#','') !=  ''); 
    renderDirectory( window.location.hash.replace('#',''));
  }
);

function showContent ( isShow ) {
  let slider = document.getElementsByClassName('slider-warp');
  let conteentBox = document.getElementsByClassName('content');
  if (isShow) {
    slider[0].style.display = 'none';
    conteentBox[0].style.display = 'flex';
  }
  else {
    slider[0].style.display = 'block';
    conteentBox[0].style.display = 'none';
  }
}

function renderDirectory ( hash ) {
  let content =  document.getElementsByClassName('content');
  content[0].innerHTML = '';
  if ( hash == 'NewDeveloper' ) {
    renderNewDeveloperDirectory().then(
                                    (devDir) =>{
                                      content[0].appendChild(devDir);
                                    },
                                    (error) => {
                                      let errorMessageNode = document.createTextNode(error.message);
                                      content[0].appendChild(errorMessageNode);
                                    }
                                  );
  } else {
    let text = document.createTextNode( `Дерикторія ${hash}` );
    content[0].appendChild(text);
  }
}

async function renderNewDeveloperDirectory () {

  let formElements = []; 
  let formNode = document.createElement('form');
  formNode.classList.add('developer-form');
  formNode.classList.add('form');
  formNode.setAttribute('name','newDeveloperForm');
  formNode.setAttribute('action','');

  let formHeder = document.createElement('h2');
  formHeder.textContent = 'Create new Developer';
  formElements.push(formHeder);

  let nameLabel =  document.createElement('label');
  nameLabel.classList.add('developer-form__name-label');
  nameLabel.textContent= 'Enter your name';
  nameLabel.appendChild(document.createElement('input'));
  formElements.push(nameLabel);

  let niknameLabel =  document.createElement('label');
  niknameLabel.classList.add('developer-form__nikname-label');
  niknameLabel.textContent = 'Enter your nikname ';
  niknameLabel.appendChild(document.createElement('input'));
  formElements.push( niknameLabel );
  
  let fieldset;
  try {
    fieldset = await renderSkillFieldeset();
  }
  catch ( error ) {
    throw error
  }
  let skillFieldesetWarp = document.createElement('div');
  skillFieldesetWarp.classList.add('developer-form__skill-fieldeset-warp');
  skillFieldesetWarp.appendChild(fieldset);
  formElements.push(skillFieldesetWarp);
  let newSkillFildesetBtn = document.createElement('div');
  newSkillFildesetBtn.classList.add('developer-form__skill-fildeset-btn');
  newSkillFildesetBtn.textContent = 'Add new skill';
  newSkillFildesetBtn.addEventListener('click', async() => { 
                                                              let newSkillFildeset = await renderSkillFieldeset(); 
                                                              skillFieldesetWarp.appendChild(newSkillFildeset);
                                                            });

  formElements.push(newSkillFildesetBtn); 

  let btnDiv = document.createElement('div');
  btnDiv.classList.add('developer-form__submit-div');
  let submitBtn = document.createElement('input');
  submitBtn.setAttribute('type','submit');
  submitBtn.setAttribute('value','Submit');
  submitBtn.classList.add('developer-form__btn');
  let resetBtn = document.createElement('input');
  resetBtn.setAttribute('type','reset');
  resetBtn.setAttribute('value','Reset');
  resetBtn.classList.add('developer-form__btn');
  btnDiv.appendChild(submitBtn);
  btnDiv.appendChild(resetBtn);
  formElements.push(btnDiv);
  for(el of formElements) {
    formNode.appendChild(el);
  }
  return formNode;

  async function renderSkillFieldeset () {

    let skillFieldesetNode = document.createElement('fieldset'),
        selectSkillNode = document.createElement('select'),
        selectMarkNode = document.createElement('select'),
        skillsList;
    skillFieldesetNode.classList.add('developer-form__skill-fildeset');
    selectSkillNode.classList.add('developer-form__select-skill-node');
    selectMarkNode.classList.add('developer-form__select-mark-node');
    try {
      skillsList = await getSkills();
    }
    catch (error) {
      throw error
    }  
    for (skill of skillsList) {
      let option = document.createElement('option');
      option.appendChild(document.createTextNode(skill.areaName));
      option.setAttribute('value',skill);
      selectSkillNode.appendChild(option);
    }  
    skillFieldesetNode.appendChild(selectSkillNode);
    for (let mark = 0; mark < 5; mark++) {
      let option = document.createElement('option');
      option.appendChild(document.createTextNode(mark+1));
      option.setAttribute('value', mark);
      selectMarkNode.appendChild(option);
    }
    skillFieldesetNode.appendChild(selectMarkNode);
    return skillFieldesetNode; 
  };

  async function getSkills () {
    try {
      const response = await fetch('/knowledgeareas');
      const skillsList = await response.text();
      return JSON.parse( skillsList );
    }
    catch ( error ) {
      throw new Error('Failed to retrieve data from server')
    }
  }

}

  
