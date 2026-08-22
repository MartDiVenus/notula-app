const redirectUri = encodeURIComponent("https://localhost");
const scope = encodeURIComponent("https://www.googleapis.com/auth/drive.file");
const cId = "33907494746-u2ag4a79qplv6l4430smo93vb3q77qpf.apps.googleusercontent.com";
let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
console.log(url);
