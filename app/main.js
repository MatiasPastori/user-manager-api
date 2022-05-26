loadInitialTemplate = () => {
    const template = `
    <h1>Users Manager API <h1>
    <h2>Main Dashboard<h2>
        <form id="user-form">
        <div>
            <label>Firstname</label>
            <input name="firstName"/>
        </div>
        <div>
        <label>Lastname</label>
        <input name="lastName"/>
    </div>
    <button type="submit"> Send </button>
    </form>
    <ul id="user-list"></ul>
    `
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getUsers = async () => {
    const response = await fetch('/users');
    const users = await response.json();
    const template = user => `
        <li>
            ${user.firstName} ${user.lastName} <button user-id="${user._id}">Eliminar</button>
        </li>
    `
    const userList = document.getElementById('user-list');
    userList.innerHTML = users.map(user => template(user)).join('');

    if (users) {
        users.forEach(user => {
            const userNode = document.querySelector(`[user-id="${user._id}"]`)
            userNode.onclick = async (e) => {
                await fetch(`users/${user._id}`,
                    {
                        method: 'DELETE',
                    })
                //We need to go one element up in the HTML tree due to the fact that we want to delete the li element, not the button.
                userNode.parentNode.remove();
                alert(`The user ${user._id} has been deleted successfully`)
            }
        })
    }
}

const addFormListener = () => {
    const userForm = document.getElementById("user-form");
    userForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        //  Hacerlo de esta forma seria muy mala idea en el caso de que nuestro formulario tuviese mas campos...
        // console.log(formData.get('firstname'));
        const data = Object.fromEntries(formData.entries());
        await fetch('/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        userForm.reset();
        getUsers();
    }
}

const checkLogin = () => {
    localStorage.getItem('jwt');
}

const loadUserDashboard = () => {
    loadInitialTemplate();
    addFormListener();
    getUsers();
}


const loadLoginTemplate = () => {
    const template = `
        <h1>Users Manager API <h1>
        <h2>User Login<h2>
            <form id="login-form">
            <div>
                <label>Email</label>
                <input type="email" name="email" required/>
            </div>
            <div>
            <label>Password</label>
            <input type="password" name="password" required/>
        </div>
        <button type="submit"> Send </button>
        </form>
        <a href="#" id="register">Don't have an account yet? Registrate!</a>
        <div id="error"></div>
        `
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}


const addLoginListener = () => {
    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/JSON',
            }
        })
        const responseData = await response.text();
        if (response.status >= 300) {
            const errorNode = document.getElementById('error');
            errorNode.innerHTML = responseData;
        } else {
            console.log(responseData);
        }
    }
}


const loadRegisterTemplate = () => {
    const template = `
    <h1>Users Manager API <h1>
    <h2>User Register<h2>
        <form id="register-form">
        <div>
            <label>Email</label>
            <input type="email" name="email" required/>
        </div>
        <div>
        <label>Password</label>
        <input type="password" name="password" required/>
    </div>
    <button type="submit"> Send </button>
    </form>
    <a href="#" id="login">Already have an Account? Login Here!</a>
    <div id="error"></div>
    `
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}


const addRegisterListener = () => {
    const registerForm = document.getElementById('register-form');
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/JSON',
            }
        })
        const responseData = await response.text();
        if (response.status >= 300) {
            const errorNode = document.getElementById('error');
            errorNode.innerHTML = responseData;
        } else {
            console.log(responseData);
        }
    }
 }

const goToLoginListener = () => {
    const loginLink = document.getElementById('login');
    loginLink.onclick = async (e) => {
        e.preventDefault();
        loadLoginPage();
    }
}

loadRegisterPage = () => {
    loadRegisterTemplate();
    addRegisterListener();
    goToLoginListener();
}


const goToRegisterListener = () => {
    const registerLink = document.getElementById('register');
    registerLink.onclick = async (e) => {
        e.preventDefault();
        loadRegisterPage();
    }
}

loadLoginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    goToRegisterListener()
}

window.onload = () => {
    const isLogged = checkLogin()
    if (isLogged) {
        loadUserDashboard()
    } else {
        loadLoginPage()
    }
}