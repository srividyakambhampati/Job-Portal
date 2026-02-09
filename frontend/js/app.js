document.addEventListener('DOMContentLoaded', () => {
    updateNav();
});

function updateNav() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const authNav = document.getElementById('auth-nav');

    if (token && user) {
        let links = `
            <li class="nav-item">
                <a class="nav-link" href="dashboard.html">Dashboard</a>
            </li>
        `;

        if (user.role === 'employer' || user.role === 'admin') {
            links += `
                <li class="nav-item">
                    <a class="nav-link" href="post-job.html">Post Job</a>
                </li>
            `;
        }

        links += `
            <li class="nav-item">
                <button class="btn btn-outline-danger btn-sm ms-2" onclick="logout()">Logout</button>
            </li>
            <li class="nav-item ms-2 d-flex align-items-center">
                 <span class="badge bg-secondary">${user.name} (${user.role})</span>
            </li>
        `;
        authNav.innerHTML = links;
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html">Register</a>
            </li>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}
