/* The value should be replaced with a valid API key
before running the code. */
const OPENAI_API_KEY = "your_api_key";

const textarea = document.querySelector(
  'textarea[placeholder="Add your title"]'
);

/**
 * The function unselects all selected descriptions in popup grids.
 */
function unselectAllDescriptions() {
  const popupGrids = document.querySelectorAll(".popup-grid");

  popupGrids.forEach((popupGrid) => {
    const lastChild = popupGrid.lastElementChild;
    lastChild.classList.remove("option--selected");
  });
}

/**
 * The function unselects all selected titles in the popup.
 */
function unselectAllTitles() {
  const popupGridDivs = document.querySelectorAll("div.popup-grid");

  popupGridDivs.forEach((div) => {
    div.firstElementChild.classList.remove("option--selected");
  });
}

/**
 * The function dispatches a paste event with specified text to a target element.
 * @param target - The target parameter is the element on which the paste event is being dispatched. It
 * could be an input field, a text area, or any other element that can receive text input.
 * @param text - The text parameter is the string of text that you want to simulate pasting into the
 * target element.
 */
function dispatchPaste(target, text) {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData("text/plain", text);

  target.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    })
  );
  dataTransfer.clearData();
}

let selectedTitle = "";
let selectedDescription = "";

// Used for testing in development instead of making multiple calls to the API because its expensive >.<
const suggestions = [
  {
    title: "20 Best Websites for Finding Remote Work in 2021",
    description:
      "Looking for a remote job? Discover the 20 best websites that can help you find the perfect opportunity to work from anywhere in the world.",
  },
  {
    title: "Get Hired Remotely: 20 Websites to Find Your Next Job",
    description:
      "Tired of the traditional office setting? Check out these 20 websites that can connect you with remote work opportunities, and start working from anywhere you want!",
  },
  {
    title: "20 Sites That Make Finding Remote Work a Breeze",
    description:
      "Finding remote work can be challenging, but not with these 20 websites that simplify the process and help you land your dream job.",
  },
  {
    title: "Find Your Dream Remote Job with These 20 Websites",
    description:
      "Work from anywhere and enjoy the flexibility of remote work. Explore these 20 websites and discover your dream job today!",
  },
  {
    title: "20 Websites That Connect You with Remote Work Opportunities",
    description:
      "Ready to join the remote work revolution? These 20 websites can help you find the best remote work opportunities that fit your skills and experience.",
  },
];

function setButtonToActiveState() {
  button.classList.add("complete-btn--active");
  button.classList.remove("complete-btn--inactive");
}

function setButtonToInactiveState() {
  button.classList.add("complete-btn--inactive");
  button.classList.remove("complete-btn--active");
}

function createPopupTitle() {
  const titleH2 = document.createElement("h2");
  titleH2.textContent = "Title:";
  return titleH2;
}

function createPopupDescription() {
  const descriptionH2 = document.createElement("h2");
  descriptionH2.textContent = "Description:";
  return descriptionH2;
}

function createPopupCancelButton(popup) {
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("cancel-btn");
  cancelButton.innerText = "Cancel";
  cancelButton.addEventListener("click", () => {
    selectedDescription = "";
    selectedTitle = "";
    document.body.removeChild(popup);
  });
  return cancelButton;
}

function createPopupProceedButton() {
  const proceedButton = document.createElement("button");
  proceedButton.classList.add("complete-btn", "complete-btn--inactive");
  proceedButton.textContent = "Proceed";
  return proceedButton;
}

function appendPopup(suggestions) {
  const popup = document.createElement("div");
  popup.classList.add("suggestions-popup");

  const div = document.createElement("div");
  div.classList.add("popup-grid");
  popup.appendChild(div);

  div.appendChild(createPopupTitle());
  div.appendChild(createPopupDescription());

  const bottomDiv = document.createElement("div");
  bottomDiv.classList.add("popup-action-btns-container");

  bottomDiv.appendChild(createPopupCancelButton(popup));

  const proceedButton = createPopupProceedButton();
  proceedButton.addEventListener("click", () => {
    textarea.value = selectedTitle;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const descriptionEditor = document.querySelector(
      'div[aria-label="Tell everyone what your Pin is about"]'
    );
    descriptionEditor.focus();

    dispatchPaste(descriptionEditor, selectedDescription);

    document.body.removeChild(popup);
  });
  bottomDiv.appendChild(proceedButton);

  suggestions.forEach(({ title, description }) => {
    const div = document.createElement("div");
    div.classList.add("popup-grid");
    popup.appendChild(div);

    const titleElement = document.createElement("div");
    titleElement.textContent = title;
    titleElement.addEventListener("click", () => {
      unselectAllTitles();
      if (selectedTitle === title) {
        selectedTitle = "";
        if (!selectedDescription) {
          proceedButton.classList.remove("complete-btn--active");
          proceedButton.classList.add("complete-btn--inactive");
        }
      } else {
        selectedTitle = title;
        titleElement.classList.add("option--selected");
        proceedButton.classList.add("complete-btn--active");
        proceedButton.classList.remove("complete-btn--inactive");
      }
    });

    div.appendChild(titleElement);

    const descriptionElement = document.createElement("div");
    descriptionElement.textContent = description;
    descriptionElement.style.border = "1px solid #efefef";
    descriptionElement.style.borderRadius = "8px";
    descriptionElement.addEventListener("click", () => {
      unselectAllDescriptions();
      if (selectedDescription === description) {
        selectedDescription = "";
        if (!selectedTitle) {
          proceedButton.classList.remove("complete-btn--active");
          proceedButton.classList.add("complete-btn--inactive");
        }
      } else {
        selectedDescription = description;
        descriptionElement.classList.add("option--selected");
        proceedButton.classList.add("complete-btn--active");
        proceedButton.classList.remove("complete-btn--inactive");
      }
    });
    div.appendChild(descriptionElement);
  });

  popup.appendChild(bottomDiv);

  document.body.appendChild(popup);
}

textarea.addEventListener("input", (event) => {
  if (event.target.value.length > 0) {
    setButtonToActiveState();
  } else {
    setButtonToInactiveState();
  }
});

const buttonContainer = document.querySelector(
  'div[data-test-id="pin-draft-alt-text-button"]'
);

// Add Pin help button to the page
const button = document.createElement("button");
button.innerText = "Complete With AI";
button.classList.add("complete-btn", "complete-btn--inactive");

button.addEventListener("click", () => {
  setButtonToInactiveState();

  // Uncomment below to test
  // appendPopup(suggestions);
  const pinTitle = textarea?.value;

  // Comment below if block to test with mock data instead
  if (pinTitle) {
    const prompt = `
    Please suggest 5 Pinterest pin titles and descriptions to maximize reach on this topic: "${pinTitle}".
    Return a JSON object in the following format:
    '
    {suggestions:[{"title": "title", "description": "description"}]}
    '
    `;
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        /* `temperature` is a parameter used in the OpenAI API request to control the creativity
        of the generated text. A higher temperature value will result in more creative and diverse
        responses, while a lower temperature value will result in more conservative and predictable
        responses. A value of 0.5 is a moderate temperature that balances creativity and
        predictability. */
        temperature: 0.5,
        /* `max_tokens` is a parameter used in the OpenAI API request to specify the maximum
        number of tokens (words or subwords) that the API should generate in the response. In this
        case, it is set to 500, which means that the API will generate a response with a maximum of
        500 tokens. This parameter can be adjusted to control the length and complexity of the
        generated text. */
        max_tokens: 500,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { suggestions } = JSON.parse(data?.choices?.[0]?.text?.trim());
        if (suggestions) {
          appendPopup(suggestions);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setButtonToActiveState();
      });
  }
});

if (buttonContainer) {
  buttonContainer.appendChild(button);
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
}
