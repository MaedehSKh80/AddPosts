const FormEl = document.querySelector("#post-form");
const ListEl = document.querySelector("#post-list");

class Post {
  constructor(title, author, text) {
    this.title = title;
    this.author = author;
    this.text = text;
  }
}

class UI {
  addPostToList(post) {
    // get list post
    const list = document.querySelector("#post-list");

    //   create tr element
    const row = document.createElement("tr");
    const PostEl = `
         <th> ${post.title} </th>
         <th> ${post.author} </th>
         <th> ${post.text} </th>
         <td> <i class =" fa fa-times text-danger delete"></i></td>
          `;
    row.innerHTML = PostEl;

    list.appendChild(row);
  }

  ShowAlert(AlertMessage, AlertClassName) {
    const div = document.createElement("div");

    //show alert is danger or success by class name
    div.className = `alert alert-${AlertClassName}`;

    div.appendChild(document.createTextNode(AlertMessage));

    // adding alert before the form element
    FormEl.insertAdjacentElement("beforebegin", div);

    // removing the alert after 3 seconds

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  // emptying input boxes after posting
  clearInputs() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#text").value = "";
  }

  deletPost(clickedElement) {
    clickedElement.closest("tr").remove();
  }
}

class Store {
  static getPosts() {
    let posts;
    if (localStorage.getItem("posts") === null) {
      posts = [];
    } else {
      posts = JSON.parse(localStorage.getItem("posts"));
    }
    return posts;
  }

  static displayPosts() {
    const posts = Store.getPosts();
    posts.forEach((post) => {
      const ui = new UI();
      ui.addPostToList(post);
    });
  }

  static addPost(post) {
    // all posts in localStorage
    const posts = Store.getPosts();

    // new post added to the localStorage list
    posts.push(post);

    // localStorage now have all the posts even the new one
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  static removePost(title) {
    // all posts in localStorage
    const posts = Store.getPosts();

    posts.forEach((post, index) => {
      if (post.title === title) {
        posts.splice(index, 1);
      }
    });

    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

const postFunc = (e) => {
  e.preventDefault();

  // values of input
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const text = document.querySelector("#text").value;

  //   post class object
  const post = new Post(title, author, text);

  const ui = new UI();

  if (title === "" || author === "" || text === "") {
    ui.ShowAlert("تمام فیلد ها الزامی هستند!", "danger");
  } else {
    ui.addPostToList(post);

    // adding the post in the local storage
    Store.addPost(post);

    ui.ShowAlert("پست شما با موفقیت ثبت شد!", "success");
    ui.clearInputs();
  }
};

const deletfunc = (e) => {
  e.preventDefault();
  const clickedElement = e.target;

  const ui = new UI();
  if (clickedElement.classList.contains("delete")) {
    if (confirm("از حذف پست اطمینان دارید؟")) {
      const titleElement =
        clickedElement.parentElement.parentElement.firstElementChild;

      const title =
        clickedElement.parentElement.parentElement.firstElementChild.textContent.trim();
      ui.deletPost(clickedElement);

      //   delete the post even from localStorage
      Store.removePost(title);

      ui.ShowAlert(`پست مد نظر با موفقیت حذف شد!`, "warning");
    } else {
      ui.ShowAlert("پست حذف نشد!", "info");
    }
  }
};

// stored posts in the localStorage will be display when the page opens
document.addEventListener("DOMContentLoaded", Store.displayPosts);

// adding post event
FormEl.addEventListener("submit", postFunc);

// deleting the post
ListEl.addEventListener("click", deletfunc);
