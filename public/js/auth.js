document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginMessage = document.getElementById("login-message");

  const registerEmail = document.getElementById("register-email");
  const registerPassword = document.getElementById("register-password");
  const registerMessage = document.getElementById("register-message");

  const authModal = new bootstrap.Modal(document.getElementById("authModal"));

  const navBar = document.querySelector(".navbar-nav");
  const accessItem = navBar.querySelector("a[data-bs-target='#authModal']").parentElement;

  // Utilidad: Guardar y cargar usuarios desde localStorage
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  const loginUser = (email, password) => {
    const users = getUsers();
    return users.find((user) => user.email === email && user.password === password);
  };

  const updateNavbar = (email) => {
    accessItem.innerHTML = `<span class="nav-link disabled">Hola, ${email}</span>`;
  };

  // Formulario de registro
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    const users = getUsers();

    if (users.find((user) => user.email === email)) {
      registerMessage.textContent = "El usuario ya existe.";
    } else {
      saveUser({ email, password });
      registerMessage.textContent = "";
      updateNavbar(email);
      authModal.hide();
    }
  });

  // Formulario de login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    const user = loginUser(email, password);

    if (user) {
      loginMessage.textContent = "";
      updateNavbar(email);
      authModal.hide();
    } else {
      loginMessage.textContent = "Correo o contraseña incorrectos.";
    }
  });
});
