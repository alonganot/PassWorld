let key = "empty";
const defaultValue = "Info is missing!";
const emptyListString = "Your list is empty!";
const defaultPassArray = [
  {
    id: 1,
    wn: emptyListString,
    un: defaultValue,
    p: CryptoJS.AES.encrypt(defaultValue, key).toString(),
    link: defaultValue,
  },
];
const userLevels = [
  {
    value: "free",
    code: "null",
    description: "Free version",
    maxPasswords: 3,
    canEdit: false,
    canSearch: false,
    color: "black",
    bgColor: "gray",
  },
  {
    value: "gold",
    code: "34Nhjs3",
    description: "Gold Membership",
    maxPasswords: 10,
    canEdit: true,
    canSearch: false,
    color: "gold",
    bgColor: "rgb(148, 146, 44)",
  },
  {
    value: "platinum",
    code: "k3xnT1e",
    description: "Platinum Membership",
    maxPasswords: 9999,
    canEdit: true,
    canSearch: true,
    color: "rgb(40, 203, 224)",
    bgColor: "rgb(44, 136, 148)",
  },
];

const popupDelay = 2;
const longerpopUpDelay = 7;
alertify.set('notifier','delay', popupDelay);

if (
  localStorage.getItem("pws") === null ||
  localStorage.getItem("pws").length === 1
) {
  localStorage.setItem("pws", JSON.stringify(defaultPassArray));
}

let passwordArray = JSON.parse(localStorage.getItem("pws"));

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("ul")) { //first login
    $("#firstTimeModal").modal("show");
  }
  $("#passcodeModal").modal("show");
  document.getElementById("passcodeSubmit").addEventListener("click", () => {
    setKeyFromPasscode(document.getElementById("passcodeInput").value);
  });
  document.getElementById("passcodeInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      setKeyFromPasscode(document.getElementById("passcodeInput").value);
    }
  });
  $("#passcodeModal").on("hidden.bs.modal", function () {
    if (key === "empty") {
      $("#passcodeModal").modal("show");
    } else {
      if (!localStorage.getItem("ul")) {
        //first time login
        localStorage.setItem("ul", CryptoJS.AES.encrypt("null", key));
        alertify.success(`Welcome! your passcode is: ${key}, KEEP IT!`, longerpopUpDelay);
        startup();
      } else {
        //after first time
        if (dycrptPassword(localStorage.getItem("ul"), key)) {
          //the passcode is correct
          alertify.success("login was successful!");
          startup();
        } else {
          alertify.error("wrong passcode! try again!");
          document.getElementById("passcodeInput").value = "";
          $("#passcodeModal").modal("show");
        }
      }
    }
  });

  const startup = () => {
    initTable(passwordArray);
    const ul = dycrptPassword(localStorage.getItem("ul"));
    showRelevantPaymentButtons(ul);
    displayUserLevel(ul);
    manageSearchBar(ul);
  };

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

const setKeyFromPasscode = (passcode) => {
  key = passcode;
  $("#passcodeModal").modal("hide");
};
const displayUserLevel = (level) => {
  userLevels.forEach((currLevel) => {
    if (currLevel.code === `${level}`) {
      document.getElementById("userLevel").innerHTML = currLevel.description;
      document.getElementById("userLevel").style.color = currLevel.color;
      document.getElementById("userLevel").style.backgroundColor =
        currLevel.bgColor;
    }
  });
};

const manageSearchBar = (level) => {
  let canSearch = false;
  userLevels.forEach((currLevel) => {
    if (currLevel.code === `${level}`) {
      canSearch = currLevel.canSearch;
    }
  });
  if (canSearch) {
    document.getElementById("searchBar").placeholder = "Search";
    document.getElementById("searchBar").disabled = false;
  } else {
    document.getElementById("searchBar").placeholder =
      "Sorry, this is only available for platinum users! upgrade now!";
    document.getElementById("searchBar").disabled = true;
  }
};

const initTable = (currArray) => {
  document.getElementById("mainTableBody").innerHTML = "";
  document.getElementById("passSelect").innerHTML = "";

  currArray.forEach((pass, index) => {
    const row = document.createElement("tr");
    const tableIndex = document.createElement("th");
    tableIndex.innerText = index + 1;

    const currSite = document.createElement("td");
    currSite.classList.add("siteNameDiv");
    currSite.innerText = pass.wn;

    const buttons = document.createElement("td");
    buttons.setAttribute("id", "buttons");

    if (
      dycrptPassword(pass.un) !== defaultValue &&
      dycrptPassword(pass.un) !== ""
    ) {
      const userButton = document.createElement("button");
      userButton.setAttribute("type", "button");
      userButton.classList.add("btn");
      userButton.classList.add("buttonList");
      userButton.classList.add("btn-outline-primary");
      userButton.setAttribute("id", `user${index}`);
      userButton.setAttribute("data-bs-toggle", "tooltip");
      userButton.setAttribute("data-bs-placement", "top");
      userButton.setAttribute("title", "Copy the username!");
      const userIcon = document.createElement("i");
      userIcon.classList.add("fa");
      userIcon.classList.add("iconList");
      userIcon.classList.add("fa-user");
      userIcon.classList.add("fa-2x");
      userButton.appendChild(userIcon);
      userButton.addEventListener("click", () => {
        copyUser(pass.id);
      });
      buttons.appendChild(userButton);
    }

    if (
      dycrptPassword(pass.p) !== defaultValue &&
      dycrptPassword(pass.p) !== ""
    ) {
      const passwordButton = document.createElement("button");
      passwordButton.setAttribute("type", "button");
      passwordButton.classList.add("btn");
      passwordButton.classList.add("buttonList");
      passwordButton.classList.add("btn-outline-primary");
      passwordButton.setAttribute("id", `button${index}`);
      passwordButton.setAttribute("data-bs-toggle", "tooltip");
      passwordButton.setAttribute("data-bs-placement", "top");
      passwordButton.setAttribute("title", "Copy the password!");
      const copyIcon = document.createElement("i");
      copyIcon.classList.add("fa");
      copyIcon.classList.add("iconList");
      copyIcon.classList.add("fa-key");
      copyIcon.classList.add("fa-2x");
      passwordButton.appendChild(copyIcon);
      passwordButton.addEventListener("click", () => {
        copyPassword(pass.id);
      });
      buttons.appendChild(passwordButton);
    }

    if (pass.link !== defaultValue && pass.link !== "") {
      const linkButton = document.createElement("button");
      linkButton.setAttribute("type", "button");
      linkButton.classList.add("btn");
      linkButton.classList.add("buttonList");
      linkButton.classList.add("btn-outline-primary");
      linkButton.setAttribute("id", `link${index}`);
      linkButton.setAttribute("data-bs-toggle", "tooltip");
      linkButton.setAttribute("data-bs-placement", "top");
      linkButton.setAttribute("title", "Move to the page!");
      const linkIcon = document.createElement("i");
      linkIcon.classList.add("fa");
      linkIcon.classList.add("iconList");
      linkIcon.classList.add("fa-link");
      linkIcon.classList.add("fa-2x");
      linkButton.appendChild(linkIcon);
      linkButton.addEventListener("click", () => {
        linkToPage(pass.link);
      });
      buttons.appendChild(linkButton);
    }

    if (pass.wn !== emptyListString) {
      if (canEdit(dycrptPassword(localStorage.getItem("ul")))) {
        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn");
        editButton.classList.add("buttonList");
        editButton.classList.add("btn-outline-warning");
        editButton.setAttribute("id", `edit${index}`);
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#exampleModal");
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa");
        editIcon.classList.add("iconList");
        editIcon.classList.add("fa-edit");
        editIcon.classList.add("fa-2x");
        editButton.appendChild(editIcon);
        editButton.addEventListener("click", () => {
          editPassAction(pass.wn);
        });
        buttons.appendChild(editButton);
      }
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("type", "button");
      deleteButton.classList.add("btn");
      deleteButton.classList.add("buttonList");
      deleteButton.classList.add("btn-outline-danger");
      deleteButton.setAttribute("id", `delete${index}`);
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa");
      deleteIcon.classList.add("iconList");
      deleteIcon.classList.add("fa-trash");
      deleteIcon.classList.add("fa-2x");
      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener("click", () => {
        areYouSure(deletePass, pass.id);
      });
      buttons.appendChild(deleteButton);
    }

    if (buttons.innerHTML === "") {
      const defaultAction = document.createTextNode("No available actions!");
      buttons.appendChild(defaultAction);
    }

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

function areYouSure (func, param) {
  if (confirm("Are you sure you want to procceed with this action?")) {
    func(param);
  } 
};

const canEdit = (level) => {
  let canEdit = false;
  userLevels.forEach((currLevel) => {
    if (currLevel.code === `${level}`) {
      canEdit = currLevel.canEdit;
    }
  });

  return canEdit;
};

const updateTable = (input) => {
  const filteredArray = passwordArray.filter((pass) =>
    pass.wn.toLowerCase().includes(input.toLowerCase())
  );
  initTable(filteredArray);
};

const hasPassedMaxPasswords = () => {
  const level = dycrptPassword(localStorage.getItem("ul"));
  let maxPass = 3;
  userLevels.forEach((currLevel) => {
    if (currLevel.code === `${level}`) {
      maxPass = parseInt(currLevel.maxPasswords);
    }
  });

  return passwordArray.length >= maxPass;
};

const addPass = () => {
  if (hasPassedMaxPasswords()) {
    alertify.error(
      "You have reached the maximum password amount! upgrade now for more passwords!"
    );
  } else {
    const newSite = document.getElementById("newPassSite").value;
    const newUser =
      document.getElementById("newPassUser").value === ""
        ? defaultValue
        : document.getElementById("newPassUser").value;
    const newPass =
      document.getElementById("newPassPass").value === ""
        ? defaultValue
        : document.getElementById("newPassPass").value;
    const newLink =
      document.getElementById("newPassLink").value === ""
        ? defaultValue
        : document.getElementById("newPassLink").value;

    if (newSite === "" || newSite === emptyListString) {
      alertify.error("Error: You cannot add a password with this name!");
    } else {
      if (
        newUser === defaultValue ||
        newPass === defaultValue ||
        newLink === defaultValue
      ) {
        alertify.error("Notice: adding a password with missing information!");
      }
      if (isSiteNameExist(document.getElementById("newPassSite").value, 0)) {
        alertify.error("Site name is already in use!");
      } else {
        if (JSON.parse(localStorage.getItem("pws"))[0].wn === emptyListString) {
          passwordArray = [];
        }

        const newPassObj = {
          id: generateId(),
          wn: `${newSite}`,
          un: CryptoJS.AES.encrypt(newUser, key).toString(),
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
  const encryptedUsername = JSON.parse(localStorage.getItem("pws")).find(
    (pass) => pass.id === index
  ).un;

  const actualUsername = dycrptPassword(encryptedUsername);

  navigator.clipboard.writeText(actualUsername).then(
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
    ? dycrptPassword(selectedSite.un)
    : dycrptPassword(defaultPassArray[0].un);
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

const editPassAction = (wn) => {
  document.getElementById("passSelect").value = wn;
  changeSelectedPass();
};

const changePassInfo = () => {
  const passToEdit = document.getElementById("passSelect").value;
  const passToEditId = passwordArray.find((pass) => pass.wn === passToEdit).id;

  if (document.getElementById("siteName1").value === "") {
    alert("error! some fields cannot be empty!");
  } else {
    if (
      isSiteNameExist(document.getElementById("siteName1").value, passToEditId)
    ) {
      alert("error! this site name is already in use!");
    } else {
      const editedPass = {
        id: passToEditId,
        wn: document.getElementById("siteName1").value,
        un: CryptoJS.AES.encrypt(
          document.getElementById("userName1").value,
          key
        ).toString(),
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
      $("#exampleModal").modal("hide");
      initTable(passwordArray);
    }
  }
};
