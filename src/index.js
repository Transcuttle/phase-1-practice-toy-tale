let addToy = false;

function createCard(toy){
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const button = document.createElement('button');

  div.setAttribute('class', 'card');
  h2.textContent = toy.name;
  img.setAttribute('src', toy.image);
  img.setAttribute('class', 'toy-avatar');
  p.textContent = `${toy.likes} Likes`;
  button.setAttribute('class', 'like-btn');
  button.setAttribute('id', `a${toy.id}`);
  button.textContent = 'Like ❤️'
  button.addEventListener('click', () => updateCard(`${toy.id}`))
  
  div.appendChild(h2);
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(button);

  document.querySelector('#toy-collection').appendChild(div);
}

function createToyCollection(){
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(list => list.forEach(e => createCard(e)));
}

function handleForm(){
  document.querySelector('.add-toy-form').addEventListener('submit', e => {
    e.preventDefault();
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'name': e.target[0].value,
        'image': e.target[1].value,
        'likes': 0
      })
    })
    .then(res => res.json())
    .then(toy => createCard(toy));
  })
}

function updateCard(id){
  fetch(`http://localhost:3000/toys/${id}`)
  .then(res => res.json())
  .then(toy => increaseLikes(toy.id, toy.likes))
  .then(info => document.querySelector(`#a${info[0]}`).previousSibling.textContent = `${info[1]} Likes`)
}

function increaseLikes(id, likes){
  likes++
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': likes
    })
  })
  .then(res => res.json())
  .then(likes => console.log(likes))
  return [id, likes];
}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  createToyCollection();
  handleForm();
});
