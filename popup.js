const key = "Capibara2019!";

const defaultPassArray = [
  {
    id: 1,
    wn: "Your list is empty!",
    un: "Add a username!",
    p: CryptoJS.AES.encrypt("Add a password!", key).toString(),
    link: "http://www.google.com",
  },
];

if (
  localStorage.getItem("pws") === null ||
  localStorage.getItem("pws").length === 1
) {
  localStorage.setItem("pws", JSON.stringify(defaultPassArray));
}

let passwordArray = JSON.parse(localStorage.getItem("pws"));

document.addEventListener("DOMContentLoaded", () => {
  initTable(passwordArray);
  changeSelectedPass(); //fills the edit password modal with the info of the first password

  document.getElementById("button-addon2").addEventListener("click", () => {
    addPass();
  });
  document.getElementById("passSelect").addEventListener("change", () => {
    changeSelectedPass();
  });
  document.getElementById("togglePassVis").addEventListener("click", () => {
    togglePasswordVisibility();
  });
  document
    .getElementById("changePassInfoButton")
    .addEventListener("click", () => {
      changePassInfo();
    });

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", () => {
    updateTable(searchBar.value);
  });

  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

const initTable = (currArray) => {
  document.getElementById("mainTableBody").innerHTML = "";
  document.getElementById("passSelect").innerHTML = "";

  currArray.forEach((pass, index) => {
    const row = document.createElement("tr");
    const tableIndex = document.createElement("th");
    tableIndex.innerText = index + 1;

    const currSite = document.createElement("td");
    currSite.innerText = pass.wn;

    const buttons = document.createElement("td");
    buttons.setAttribute("id", "buttons");

    const userButton = document.createElement("button");
    userButton.setAttribute("type", "button");
    userButton.classList.add("btn");
    userButton.classList.add("btn-outline-primary");
    userButton.setAttribute("id", `user${index}`);
    userButton.setAttribute("data-bs-toggle", "tooltip");
    userButton.setAttribute("data-bs-placement", "top");
    userButton.setAttribute("title", "Copy the username!");

    const copyButton = document.createElement("button");
    copyButton.setAttribute("type", "button");
    copyButton.classList.add("btn");
    copyButton.classList.add("btn-outline-primary");
    copyButton.setAttribute("id", `button${index}`);
    copyButton.setAttribute("data-bs-toggle", "tooltip");
    copyButton.setAttribute("data-bs-placement", "top");
    copyButton.setAttribute("title", "Copy the password!");

    const linkButton = document.createElement("button");
    linkButton.setAttribute("type", "button");
    linkButton.classList.add("btn");
    linkButton.classList.add("btn-outline-primary");
    linkButton.setAttribute("id", `link${index}`);
    linkButton.setAttribute("data-bs-toggle", "tooltip");
    linkButton.setAttribute("data-bs-placement", "top");
    linkButton.setAttribute("title", "Move to the page!");

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-outline-danger");
    deleteButton.setAttribute("id", `delete${index}`);

    const userIcon = document.createElement("i");
    userIcon.classList.add("fa");
    userIcon.classList.add("fa-user");
    userIcon.classList.add("fa-2x");

    const copyIcon = document.createElement("i");
    copyIcon.classList.add("fa");
    copyIcon.classList.add("fa-key");
    copyIcon.classList.add("fa-2x");

    const linkIcon = document.createElement("i");
    linkIcon.classList.add("fa");
    linkIcon.classList.add("fa-link");
    linkIcon.classList.add("fa-2x");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.classList.add("fa-2x");

    userButton.appendChild(userIcon);
    copyButton.appendChild(copyIcon);
    linkButton.appendChild(linkIcon);
    deleteButton.appendChild(deleteIcon);

    userButton.addEventListener("click", () => {
      copyUser(pass.id);
    });

    copyButton.addEventListener("click", () => {
      copyPassword(pass.id);
    });

    linkButton.addEventListener("click", () => {
      linkToPage(pass.link);
    });

    deleteButton.addEventListener("click", () => {
      deletePass(pass.id);
    });

    buttons.appendChild(userButton);
    buttons.appendChild(copyButton);
    buttons.appendChild(linkButton);
    buttons.appendChild(deleteButton);

    row.appendChild(tableIndex);
    row.appendChild(currSite);
    row.appendChild(buttons);

    document.getElementById("mainTableBody").appendChild(row);

    const option = document.createElement("option");
    option.setAttribute("value", pass.wn);
    option.innerText = pass.wn;
    document.getElementById("passSelect").appendChild(option);
  });
};

const updateTable = (input) => {
  const filteredArray = passwordArray.filter((pass) =>
    pass.wn.toLowerCase().includes(input.toLowerCase())
  );
  initTable(filteredArray);
};

const addPass = () => {
  const newSite = document.getElementById("newPassSite").value;
  const newUser =
    document.getElementById("newPassUser").value === ""
      ? "Info is missing!"
      : document.getElementById("newPassSite").value;
  const newPass =
    document.getElementById("newPassPass").value === ""
      ? "Info is missing!"
      : document.getElementById("newPassPass").value;
  const newLink =
    document.getElementById("newPassLink").value === ""
      ? "Info is missing!"
      : document.getElementById("newPassLink").value;

  if (newSite === "") {
    alertify.error("Error: You cannot add a password without a name!");
  } else {
    if (
      newUser === "Info is missing!" ||
      newPass === "Info is missing!" ||
      newLink === "Info is missing!"
    ) {
      alertify.error("Notice: adding a password without the information!");
    }
    if (isSiteNameExist(document.getElementById("newPassSite").value, 0)) {
      alertify.error("Site name is already in use!");
    } else {
      if (
        JSON.parse(localStorage.getItem("pws"))[0].wn === "Your list is empty!"
      ) {
        passwordArray = [];
      }

      const newPassObj = {
        id: generateId(),
        wn: `${newSite}`,
        un: `${newUser}`,
        p: CryptoJS.AES.encrypt(newPass, key).toString(),
        link: `${newLink}`,
      };

      passwordArray.push(newPassObj);
      localStorage.setItem("pws", JSON.stringify(passwordArray));
      document.getElementById("newPassSite").value = "";
      document.getElementById("newPassUser").value = "";
      document.getElementById("newPassPass").value = "";
      document.getElementById("newPassLink").value = "";
      alertify.success("Password added successfully!");
      initTable(passwordArray);
      changeSelectedPass();
    }
  }
};

const isSiteNameExist = (name, id) => {
  return passwordArray.find((pass) => pass.wn === name && pass.id !== id);
};

const generateId = () => {
  let newId = passwordArray.length + 1;
  newId += Math.random();

  return newId;
};

const copyUser = (index) => {
  const username = JSON.parse(localStorage.getItem("pws")).find(
    (pass) => pass.id === index
  ).un;

  navigator.clipboard.writeText(username).then(
    () => {
      console.log("Async: Copying to clipboard was successful!");
    },
    (err) => {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

const copyPassword = (index) => {
  const encryptedPass = JSON.parse(localStorage.getItem("pws")).find(
    (pass) => pass.id === index
  ).p;

  const actualPass = dycrptPassword(encryptedPass);

  navigator.clipboard.writeText(actualPass).then(
    () => {
      console.log("Async: Copying to clipboard was successful!");
    },
    (err) => {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

const dycrptPassword = (password) => {
  const decrypted = CryptoJS.AES.decrypt(password, key);

  return decrypted.toString(CryptoJS.enc.Utf8);
};

const linkToPage = (link) => {
  window.open(link);
};

const deletePass = (id) => {
  passwordArray = passwordArray.filter((pass) => pass.id !== id);
  if (passwordArray.length === 0) {
    localStorage.setItem("pws", JSON.stringify(defaultPassArray));
    initTable(defaultPassArray);
  } else {
    localStorage.setItem("pws", JSON.stringify(passwordArray));
    initTable(passwordArray);
  }
  changeSelectedPass();
  alertify.warning("Password deleted successfully!");
};

const changeSelectedPass = () => {
  const selectedSite = passwordArray.find(
    (pass) => pass.wn === document.getElementById("passSelect").value
  );

  document.getElementById("siteName1").value = selectedSite
    ? selectedSite.wn
    : defaultPassArray[0].wn;
  document.getElementById("userName1").value = selectedSite
    ? selectedSite.un
    : defaultPassArray[0].un;
  document.getElementById("password1").value = selectedSite
    ? dycrptPassword(selectedSite.p)
    : dycrptPassword(defaultPassArray[0].p);
  document.getElementById("myLink1").value = selectedSite
    ? selectedSite.link
    : defaultPassArray[0].link;
};

const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById("password1");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
};

const changePassInfo = () => {
  const passToEdit = document.getElementById("passSelect").value;
  const passToEditId = passwordArray.find((pass) => pass.wn === passToEdit).id;

  if (
    document.getElementById("siteName1").value === "" ||
    document.getElementById("userName1").value === "" ||
    document.getElementById("password1").value === ""
  ) {
    alert("error! fields cannot be empty!");
  } else {
    if (
      isSiteNameExist(document.getElementById("siteName1").value, passToEditId)
    ) {
      alert("error! this site name is already in use!");
    } else {
      const editedPass = {
        id: passToEditId,
        wn: document.getElementById("siteName1").value,
        un: document.getElementById("userName1").value,
        p: CryptoJS.AES.encrypt(
          document.getElementById("password1").value,
          key
        ).toString(),
        link: document.getElementById("myLink1").value,
      };

      passwordArray = passwordArray.map((pass) =>
        pass.wn === passToEdit ? editedPass : pass
      );
      localStorage.setItem("pws", JSON.stringify(passwordArray));

      document.getElementById("siteName1").value = "";
      document.getElementById("userName1").value = "";
      document.getElementById("password1").value = "";
      document.getElementById("myLink1").value = "";

      alert("success! information edited successfully!");
      initTable(passwordArray);
    }
  }
};
