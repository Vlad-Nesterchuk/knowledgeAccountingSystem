
window.onload = async() => {
  if ( window.location.hash.match(/((?<=#).+(?=\?))|(((?<=#).+(?=$)))/)[0]) {
    showContent( true ); 
    renderDirectory(window.location.hash.match(/((?<=#).+(?=\?))|(((?<=#).+(?=$)))/)[0]);
  }
  else {
    showContent( false );
  }
}

window.addEventListener ( 'hashchange', () => { 
  let heshReg = /((?<=#).+(?=\?))|(((?<=#).+(?=$)))/;
  showContent(window.location.hash.match(heshReg)[0]);
  renderDirectory(window.location.hash.match(heshReg)[0]);
});



function showContent ( isShow ) {
  let slider = document.querySelector('.slider-warp');
  let conteentBox = document.querySelector('.content');
  if (isShow) {
    slider.style.display = 'none';
    conteentBox.style.display = 'flex';
    let contentWarps = document.querySelectorAll('.content-warp');
    contentWarps.forEach(element => {
      if (element.classList.contains(window.location.hash.match(/((?<=#).+(?=\?))|(((?<=#).+(?=$)))/)[0])){
        element.setAttribute('visible', 'true');
      }
      else {
        element.setAttribute('visible', 'false');
      }
    });
  }
  else {
    slider.style.display = 'block';
    conteentBox.style.display = 'none';
  }
}



function renderDirectory ( hash ) {
  
  if ( hash == 'new-developer' ) {
    renderNewDeveloperDirectory().then(
      (devDir) => {
        document.querySelector('.new-developer').innerHTML ='';
        document.querySelector('.new-developer').appendChild(devDir);
      },
      (error) => { 
        let errorMessageNode = document.createTextNode(error.message);
        document.querySelector('.content').appendChild(errorMessageNode);
      });
  } 
  else if ( hash == 'developers-list') {
    renderDeveloperListDirectory();
  } 
  
}

async function renderDeveloperListDirectory(){
  let dataList = await getDataList ('./developers');
  let developers = new Developers(dataList);
  let developersView = document.querySelector('.developers-view');
  developersView.innerHTML='';
  developersView.setAttribute('visible','false');
  for (const developer of developers.getDevelopersList()) {
    developersView.appendChild(await renderDeveloperWarp(developer))
  }
  let paginationWarp = document.createElement('div');
  paginationWarp.classList.add('pagination-button-warp');
  paginationUrlList = pagination(document.getElementsByClassName('developer-warp'));
  for (const paginationUrl of paginationUrlList) {
    paginationLink = document.createElement("a");
    paginationLink.setAttribute('href',paginationUrl);
    linkText = paginationUrl.match(/((?<=page=).+(?=\&))|(((?<=page=).+(?=$)))/);
    paginationLink.textContent  = linkText[0];
    paginationWarp.appendChild(paginationLink);
  }
  developersView.appendChild(paginationWarp);
  developersView.setAttribute('visible','true');
  async function renderDeveloperWarp(developer) {
    let developerWarp = document.createElement('div');
    developerWarp.classList.add('developer-warp');
    let devFoto = document.createElement('img');
    devFoto.setAttribute('src','./img/developer.png');
    devFoto.classList.add('developer-warp_developer-foto')
    developerWarp.appendChild(devFoto);
    let nameField = document.createElement('h3');
    nameField.textContent = `Name: ${developer.name}`; 
    developerWarp.appendChild(nameField);
    let nikNameField = document.createElement('h3');
    nikNameField.textContent  = `Nikname: ${developer.nikname}`;
    developerWarp.appendChild(nikNameField);
    let skillsList = await getDataList('./knowledgeareas');
    
    let skillWarp = document.createElement('div');
    skillWarp.classList.add('developer-warp__skill-warp')
    
    for (const skill of developer.knowledgesMarks) {
      let skillItem = document.createElement("div");
      skillItem.classList.add('developer-warp__skill-item');
      let skillName = document.createElement("div");
      let markItem = document.createElement("div");
      markItem.textContent = skill.mark;
      let skillData = skillsList.find((el) => {
        return skill.idKowledge == Number.parseInt(el.idKowledge);
      });
      skillName.textContent = skillData.knowledgeName;
      skillItem.appendChild(skillName);
      skillItem.appendChild(markItem);
      skillWarp.appendChild(skillItem);
    }
    developerWarp.appendChild(skillWarp);
    return developerWarp;
  }
}

async function renderNewDeveloperDirectory () {

  let formElements = []; 
  let formNode = document.createElement('form');
  formNode.classList.add('developer-form');
  formNode.classList.add('form');
  formNode.setAttribute('name','newDeveloperForm');
  formNode.setAttribute('method','post');

  let formHeder = document.createElement('h2');
  formHeder.textContent = 'Create new Developer';
  formElements.push(formHeder);

  let nameLabel =  document.createElement('label');
  nameLabel.classList.add('developer-form__name-label');
  nameLabel.textContent = 'Enter your name';
  let nameInput = nameLabel.appendChild(document.createElement('input'));
  nameInput.setAttribute('id','developerName');
  formElements.push(nameLabel);

  let niknameLabel =  document.createElement('label');
  niknameLabel.classList.add('developer-form__nikname-label');
  niknameLabel.textContent = 'Enter your nikname ';
  let niknameInput = niknameLabel.appendChild(document.createElement('input'));
  niknameInput.setAttribute('id','developerNikname');
  formElements.push( niknameLabel );
  
  let skillFieldesetWarp = document.createElement('div');
  let fieldset = await renderSkillFieldeset();
  fieldset.setAttribute('name','knowledgesMarks');
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
  };
  formNode.addEventListener ('submit', (event) => {
    event.preventDefault();
    let fieldsetList = document.getElementsByClassName('developer-form__skill-fildeset');
    let fildsData = {};
    fildsData.name = document.getElementById('developerName').value;
    fildsData.nikname = document.getElementById('developerNikname').value;
    fildsData.knowledgesMarks = [];
    for (let i=0; i<fieldsetList.length;++i) {
       fildsData.knowledgesMarks[i] = [fieldsetList.item(i).children.item(0).value,fieldsetList.item(i).children.item(1).value];
    };
    submitDevelopersList(fildsData).then(() => {
      formNode.reset();
      formNode.querySelector('.developer-form > h2').innerHTML = "Submited successfully"
    },
    (error) => { 
      document.querySelector('.developer-form > h2').innerHTML = "Send error"
      console.error(error);
    });
    formNode.dispatchEvent(new Event('reset'));
  });
  formNode.addEventListener ('reset', (event) => {
    formNode.querySelector('.developer-form__skill-fieldeset-warp').innerHTML = '';
    formNode.querySelector('.developer-form > h2').innerHTML = "Create new Developer";
    formNode.querySelector('.developer-form__skill-fildeset-btn').dispatchEvent(new Event('click'));
  })
  return formNode;

  async function submitDevelopersList(fildsData){
    let dataList = await getDataList ('./developers');
    let developers = new Developers(dataList);
    developers.addNewDeveloper(fildsData.name,fildsData.nikname,fildsData.knowledgesMarks);
    let jsonData = JSON.stringify(developers.getDevelopersList());
    await fetch('./developers', { 
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: jsonData
  })}

  async function renderSkillFieldeset () {

    let skillFieldesetNode = document.createElement('fieldset'),
        selectSkillNode = document.createElement('select'),
        selectMarkNode = document.createElement('select'),
        removeSkillFieldeset = document.createElement('div'),
        skillsList;
    skillFieldesetNode.classList.add('developer-form__skill-fildeset');
    selectSkillNode.classList.add('developer-form__select-skill-node');
    selectMarkNode.classList.add('developer-form__select-mark-node');
    removeSkillFieldeset.classList.add('developer-form__remove-skill-fieldeset')
    try {
      skillsList = await getDataList('./knowledgeareas');
    }
    catch (error) {
      throw error
    }  
    for (skill of skillsList) {
      let option = document.createElement('option');
      option.appendChild(document.createTextNode(skill.knowledgeName));
      option.setAttribute('value',skill.idKowledge);
      selectSkillNode.appendChild(option);
    }  
    skillFieldesetNode.appendChild(selectSkillNode);
    for (let mark = 0; mark < 5; mark++) {
      let option = document.createElement('option');
      option.appendChild(document.createTextNode(mark+1));
      option.setAttribute('value', mark+1);
      selectMarkNode.appendChild(option);
    }
    skillFieldesetNode.appendChild(selectMarkNode);
    removeSkillFieldeset.addEventListener('click',(elem) => {
      elem.target.parentNode.parentNode.removeChild(elem.target.parentNode)
    });
    skillFieldesetNode.appendChild(removeSkillFieldeset);
    return skillFieldesetNode; 
  };
}


 async function getDataList (url) {
    try {
      const response = await fetch(url);
      const dataList = await response.text();
      return JSON.parse( dataList );
    }
    catch ( error ) {
      throw new Error('Failed to retrieve data from server')
    }
  }


class Developers {

  constructor(developersList) {
    this.developersList = developersList;
  }

  setDeveloperList(developersList) {
    this.developersList = developersList;
  }

  getDevelopersList(){
    return this.developersList;
  }


  getdevelopersById(idDeveloper) {
    return this.developersList.find(developer => {return developer.idDeveloper == idDeveloper})
  }

  getDevelopersByName(name) {
    return this.developersList.filter((developer) => {developer.name == name})
  }

  getDevelopersByKnowledgesId(knowledgesIdList) {
    let newDeveloperList = this.developersList;
    for (let i=0; i < knowledgesIdList.length;++i){
      newDeveloperList = newDeveloperList.filter(developer => {
        return developer.knowledgesMarks.some(knowledge => {
          return knowledge.idKowledge == knowledgesIdList[i];
        });
      });
      
    }
    return newDeveloperList;
  }

  addNewDeveloper(name, nikname, marksList) {
    let newDeveloper = {};
    newDeveloper.idDeveloper = this.developersList.length + 1;
    newDeveloper.name = name;
    newDeveloper.nikname = nikname;
    newDeveloper.knowledgesMarks = [];
    for(let knowMark of marksList) {
      newDeveloper.knowledgesMarks.push({ "idKowledge":knowMark[0],"mark":knowMark[1]});
    }
    this.developersList.push(newDeveloper);
  }
}

function pagination(elementsList) {
  let currentPage = window.location.hash.match(/((?<=page=).+(?=\&))|(((?<=page=).+(?=$)))/);
  let curentHash = window.location.hash.match(/(#.+(?=\?))|((#.+(?=$)))/)[0];
  let numberItemsOnPage = 6;
  let numberOfPages = Math.ceil(elementsList.length / numberItemsOnPage);
  if (currentPage == null){
    currentPage = 1;
    window.location.hash += "?page=1";
  } 
  else {
    currentPage = currentPage[0];
  }
  let firstElement = ((Number(currentPage)-1)*numberItemsOnPage+1);
  for(let i = 0; i < elementsList.length; ++i) {
    if (i+1>=firstElement && i<=firstElement+numberItemsOnPage-2){
      elementsList.item(i).setAttribute('visible','true');
    }
    else {
      elementsList.item(i).setAttribute('visible','false');
    }
  }
  let idPageList = [...(new Set ([1,currentPage-1,+currentPage,1+Number(currentPage),numberOfPages].filter(item => {return item>=1&&item<=numberOfPages})))];
  
  urlList = idPageList.map((item) => item =`${curentHash}?page=${item}`);
  return urlList;
}
