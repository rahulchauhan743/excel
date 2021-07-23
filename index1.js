let allAlignmentOptions = document.querySelectorAll(".align-cell-content span");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

let allbolditalicsunderlineOptions = document.querySelectorAll(".bold-italics-underline span");

let bold = allbolditalicsunderlineOptions[0];
let italics = allbolditalicsunderlineOptions[1];
let underline = allbolditalicsunderlineOptions[2];

let font = document.querySelectorAll(".font-type-size select");
let fontType = font[0];
let fontSize = font[1];

let allColorOptions = document.querySelectorAll(".cell-color-options span");

let bgColorPicker = allColorOptions[0];
let fontColorPicker = allColorOptions[1];

let menuBarOptions = document.querySelectorAll(".menu-bar-section div");

let fileOptions = menuBarOptions[0];

let helpOptions = menuBarOptions[1];

let body = document.querySelector("body");

leftAlign.addEventListener("click", function() {
    if (lastCell != undefined) {
        lastCell.style.textAlign = "left";

        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "left";
    }
})


rightAlign.addEventListener("click", function() {
    if (lastCell) {
        lastCell.style.textAlign = "right";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "right";
    }
});


centerAlign.addEventListener("click", function() {
    if (lastCell) {
        lastCell.style.textAlign = "center";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "center";
    }
});

bgColorPicker.addEventListener("click", function() {
    let colorPickerElement = document.createElement("input");

    colorPickerElement.type = "color";

    body.append(colorPickerElement);

    colorPickerElement.click();


    colorPickerElement.addEventListener("input", function(e) {

        if (lastCell) {
            lastCell.style.backgroundColor = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");

            dataObj[address].bgColor = e.currentTarget.value;
        }

    })
})

fontColorPicker.addEventListener("click", function(e) {
    let colorPickerElement = document.createElement("input");

    colorPickerElement.type = "color";

    body.append(colorPickerElement);

    colorPickerElement.click();

    colorPickerElement.addEventListener("input", function(e) {

        if (lastCell) {
            lastCell.style.color = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");

            dataObj[address].color = e.currentTarget.value;
        }

    })

})


let g = false;

bold.addEventListener("click", function(e) {
    if (lastCell) {
        if (g == false) {
            lastCell.style.fontWeight = "bold";
            let address = lastCell.getAttribute("data-address");
            g = true;
            dataObj[address].boldunderitalic = "bold";
        } else if (g == true) {
            lastCell.style.fontWeight = "normal";
            g = false;
            dataObj[address].boldunderitalic = "normal";
        }
    }
});

let f = false;

italics.addEventListener("click", function(e) {
    if (lastCell) {
        if (f == false) {
            lastCell.style.fontStyle = "italic";
            let address = lastCell.getAttribute("data-address");
            f = true;
            dataObj[address].boldunderitalic = "italic";
        } else if (f == true) {
            lastCell.style.fontStyle = "normal";
            f = false;
            dataObj[address].boldunderitalic = "normal";
        }
    }
});
let d = false;
underline.addEventListener("click", function(e) {
    if (lastCell) {
        if (d == false) {

            lastCell.style.textDecoration = "underline";
            let address = lastCell.getAttribute("data-address");
            d = true;
            dataObj[address].boldunderitalic = "underline";
        } else if (d == true) {
            lastCell.style.textDecoration = "none";
            d = false;
            dataObj[address].boldunderitalic = "none";
        }
    }
})

fontType.addEventListener("change", function(e) {
    if (lastCell) {
        lastCell.style.fontFamily = e.currentTarget.value;
        let address = lastCell.getAttribute("data-address");
        dataObj[address].family = e.currentTarget.value;
    }
})

fontSize.addEventListener("change", function(e) {
    if (lastCell) {
        lastCell.style.fontWeight = e.currentTarget.value;

        let address = lastCell.getAttribute("data-address");
        dataObj[address].size = e.currentTarget.value;
    }
})


fileOptions.addEventListener("click", function() {
    let isOpen = fileOptions.getAttribute("data-open");

    if (isOpen == "true") {

        fileOptions.setAttribute("data-open", "false");
        document.querySelector(".file-drop-down").remove();

    } else {

        fileOptions.setAttribute("data-open", "true");

        let dropDown = document.createElement("div");

        dropDown.innerHTML = "<p>Save</p><p>Clear</p>";

        let allOptions = dropDown.querySelectorAll("p");

        allOptions[0].addEventListener("click", function() {
            localStorage.setItem("sheet", JSON.stringify(dataObj));
        })

        allOptions[1].addEventListener("click", function() {
            localStorage.setItem("sheet", "");
        })

        dropDown.classList.add("file-drop-down");

        fileOptions.append(dropDown);
    }


});


let hel = false;
helpOptions.addEventListener("click", function(e) {

    if (hel == false) {
        let helpBox = document.createElement("div");


        helpBox.classList.add("help");

        body.append(helpBox);
        hel = true;
    } else if (hel == true) {
        document.querySelector(".help").remove();

        hel = false;
    }
})