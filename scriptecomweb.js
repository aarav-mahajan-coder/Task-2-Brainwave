

let users = JSON.parse(localStorage.getItem('users')) || [];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;


let posts = JSON.parse(localStorage.getItem('posts')) || [];

const authSection = document.getElementById('auth-section');



const postSection = document.getElementById('post-section');


const loginBtn = document.getElementById('login-btn');

const registerBtn = document.getElementById('register-btn');

const logoutBtn = document.getElementById('logout-btn');

function render() {
    if (currentUser) {
        authSection.style.display = 'block';


        postSection.style.display = 'block';
        
        logoutBtn.style.display = 'inline-block';

        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';



    } else {
        authSection.style.display = 'block';
        postSection.style.display = 'none';

        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
    }
    renderPosts();
}

loginBtn.onclick = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        render();
    } else {
        alert('Invalid credentials.');
    }
};

registerBtn.onclick = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users.find(u => u.username === username)) {
        alert('User already exists.');
        return;
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('User registered. Please log in.');
};

logoutBtn.onclick = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    render();
};

document.getElementById('create-post-btn').onclick = () => {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    const newPost = {
        id: Date.now(),
        username: currentUser.username,
        title,
        content,
        comments: []
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();

    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
};

function renderPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>By ${post.username}</small>
            ${post.username === (currentUser && currentUser.username) ? `
                <button onclick="deletePost(${post.id})">Delete</button>
                <button onclick="editPost(${post.id})">Edit</button>
            ` : ''}
            <div class="comment-section" id="comments-${post.id}">
                <h4>Comments:</h4>
                ${post.comments.map(comment => `<p><strong>${comment.username}:</strong> ${comment.text}</p>`).join('')}
                ${currentUser ? `
                    <input type="text" id="comment-input-${post.id}" placeholder="Add a comment...">
                    <button onclick="addComment(${post.id})">Comment</button>
                ` : ''}
            </div>
        `;

        postsContainer.appendChild(postDiv);
    });
}

function deletePost(id) {
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    const newContent = prompt('Edit your post:', post.content);

    if (newContent !== null && newContent.trim() !== '') {
        post.content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();
    if (commentText === '') return;

    const post = posts.find(p => p.id === postId);
    post.comments.push({ username: currentUser.username, text: commentText });

    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

render();
