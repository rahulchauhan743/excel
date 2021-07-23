let rowNumberSection = document.querySelector(".row-number-section");

let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let cellSection = document.querySelector(".cell-section");

let columnTagsSection = document.querySelector(".column-tag-section");

let formulaInput = document.querySelector(".formula-input-section");

let lastCell;

let dataObj = {};




//here we do  when formula was entered from formula bar section by the user

formulaInput.addEventListener("keydown", function(e) {
    if (e.key == "Enter") { //when after formula was enterd by user and user press enter then only formula is calculated

        //here we get the formula typed by the user
        let typedFormula = e.currentTarget.value;

        //the formula typed by user only works when we have selected any cell as formula is worked upon some cell selected before
        if (lastCell == undefined) {
            return;
        }

        //here we get the address of the selected cell
        let selectedCellAddress = lastCell.getAttribute("data-address");

        //from that address of the selected cell we get the cell object of that cell
        let cellObj = dataObj[selectedCellAddress];


        //here we update the formula of seleted cell to the typed formula by user
        cellObj.formula = typedFormula;

        //then we select the  upstream of selected cell
        let upstream = cellObj.upstream;

        //1- Loop on upstream
        //2- for each upstream value go  in its downstream and remove the  curcelladdress(where vakue was updated by user)
        for (let i = 0; i < upstream.length; i++) {
            removeFromDownstream(upstream[i], selectedCellAddress);

        }

        //3- apni upstream ko empty array krdo

        cellObj.upstream = [];

        //split formula arround space to get A1 AND B1 IN FORMULA(MEANS GETTING CELL ON WHICH FORMULA WILL BE PERFORMED)
        let formulaArr = typedFormula.split(" ");
        let cellsInFormula = [];

        //here we add A1 AND B1 IN FORMULA(MEANS GETTING CELL ON WHICH FORMULA WILL BE PERFORMED) in cellsInFormula array
        for (let i = 0; i < formulaArr.length; i++) {
            if (formulaArr[i] != "+" &&
                formulaArr[i] != "*" && formulaArr[i] != "-" &&
                formulaArr[i] != "/" && isNaN(formulaArr[i]) == true) {
                cellsInFormula.push(formulaArr[i]);
            }

        }

        //here we go in downstrem of each element of upstream and add selectedcell

        for (let i = 0; i < cellsInFormula.length; i++) {
            addToDownstream(cellsInFormula[i], selectedCellAddress);
        }

        //then here we update the upstram
        cellObj.upstream = cellsInFormula;

        //further work has been commented already  below to undestand as it same as code below
        let valObj = {};

        for (let i = 0; i < cellsInFormula.length; i++) {

            let cellValue = dataObj[cellsInFormula[i]].value;

            valObj[cellsInFormula[i]] = cellValue;
        }


        for (let key in valObj) {
            typedFormula = typedFormula.replace(key, valObj[key]);
        }

        let newValue = eval(typedFormula);

        //here we update value on UI  
        lastCell.innerText = newValue;

        cellObj.value = newValue;




        let currDownstream = cellObj.downstream;



        for (let i = 0; i < currDownstream.length; i++) {

            updateCell(currDownstream[i])
        }


        dataObj[selectedCellAddress] = cellObj;

    }


});


cellSection.addEventListener("scroll", function(e) { //when we scroll cellSection 

    //when we scroll cell section if we scroll down so we will move rownumbersection in negative means upward direction
    //(sroll in negative direction value which is equal to the scroll of cell div in down) same for column to

    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`; //scrolltop means from top corner (gives number of pixels we move down from top corner)

    //scrollLeft means from left corner (gives number of pixels we move right from left corner)
    columnTagsSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
})


for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number");
    rowNumberSection.append(div);

}



for (let i = 0; i < 26; i++) {
    let asciiCode = 65 + i;

    let reqAlphabet = String.fromCharCode(asciiCode)

    let div = document.createElement("div");
    div.innerText = reqAlphabet;

    div.classList.add("column-tag");

    columnTagsSection.append(div);
}




for (let i = 1; i <= 100; i++) {

    let rowDiv = document.createElement("div");

    rowDiv.classList.add("row");

    //i = 1 [A1,B1..........Z1]
    //i = 2 []
    //.
    //.
    //i = 100 [A100.........z100]

    for (let j = 0; j < 26; j++) { //i = 100   j = 25  asciiCode = 65+25=90  alpha = z  cellAdd = Z100
        // A to Z

        let asciiCode = 65 + j;

        let reqAlphabet = String.fromCharCode(asciiCode);

        let cellAddress = reqAlphabet + i;


        dataObj[cellAddress] = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: [],
            align: "left",
            color: "black",
            bgColor: "white",
            boldunderitalic: "none",
            family: "Arial",
            size: "100"
        };



        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input", function(e) {

            // jis cell pr type kra uske attribute se maine uska cell address fetch kra
            let currCellAddress = e.currentTarget.getAttribute("data-address");


            //kuki sare cell objects dataObj me store ho rakhe h using their cell address as key
            //maine jis cell pr click krke type kra uska hi address fetch and uska hi object chahiye
            //to wo address as key use krke dataObj se fetch krlia req cellObj ko
            let currCellObj = dataObj[currCellAddress];

            //now hamne uss currCellObj jispe hamne kuch type kiya tha vo typed value ko us currCellObj ke value property me update karliya
            //yha par hamne bas types value ko currcellobject me update kiya
            currCellObj.value = e.currentTarget.innerText;

            currCellObj.formula = undefined; //as ew value is updated so forula will be udefined

            //1- Loop on upstream
            //2- for each upstream value go  in its downstream and remove the  curcelladdress(where vakue was updated by user)
            //3- apni upstream ko empty array krdo

            //getting curcell upstream
            let currUpstream = currCellObj.upstream;

            for (let k = 0; k < currUpstream.length; k++) {

                //currUpstream[k]->is the values jiske  downstream me se ham  curcelladdress remove arege
                removeFromDownstream(currUpstream[k], currCellAddress);

            }

            //after step 2 is done 
            //do step 3
            currCellObj.upstream = [];


            //curcell ki downstram
            let currDownstream = currCellObj.downstream;


            // C1(20) => [E1]  E1 (2*C1) [40]

            // ham selected celladdress ki downstram me jayeghe aur har element jho downstram me he usko bologe ki apni value update kare

            //update karne ke liye ham downstram ke element ki upstream me jayge aur har element jho upstream me he uski value formula me put karege aur re-evalute karke  formula ki value ko downstram ke elememt ki value bna dege

            for (let i = 0; i < currDownstream.length; i++) {
                //har downstram ki value  me jake usko update karne ko bolo 
                updateCell(currDownstream[i])
            }

            //after all work done on curcelladress we have to put that in main dataobject
            dataObj[cellAddress] = currCellObj;

            console.log(dataObj);
        })

        cellDiv.setAttribute("contentEditable", true); //to write 
        cellDiv.classList.add("cell");

        cellDiv.setAttribute("data-address", cellAddress);


        cellDiv.addEventListener("click", function(e) { //when we click the individual  cell so the function executes 

            //this function has two task

            //1.task select the cell and add the cell-selected class and deselect the previous cell which was selected before
            if (lastCell) {
                lastCell.classList.remove("cell-selected");
            }

            e.currentTarget.classList.add("cell-selected")

            lastCell = e.currentTarget; //put the current selected cell in the lastcell variable for next time

            //2.task
            let currCellAddress = e.currentTarget.getAttribute("data-address");

            formulaBarSelectedCellArea.innerText = currCellAddress; //here we put address of the selected cell in formulaBarSelectedCellArea section

        });

        rowDiv.append(cellDiv);
    }

    cellSection.append(rowDiv);

}

if (localStorage.getItem("sheet") != undefined) {

    dataObj = JSON.parse(localStorage.getItem("sheet"));

    for (let key in dataObj) {
        let cell = document.querySelector(`[data-address='${key}']`);
        if (dataObj[key].value != undefined) {
            cell.innerText = dataObj[key].value;
            cell.style.textAlign = dataObj[key].align;
            cell.style.backgroundColor = dataObj[key].bgColor;
            cell.style.color = dataObj[key].color;
            cell.style.fontFamily = dataObj[key].family;
            cell.style.fontWeight = dataObj[key].size;

        }
    }
}


// //to test input taken from grid

// dataObj["A1"].value = 20;
// dataObj["B1"].value = 40;
// dataObj["A1"].downstream = ["B1"];
// dataObj["B1"].formula = "2 * A1";
// dataObj["B1"].upstream = ["A1"];

// let a1cell = document.querySelector("[data-address='A1']")
// let b1cell = document.querySelector("[data-address='B1']")

// a1cell.innerText = 20;
// b1cell.innerText = 40;


// C1 = Formula(2*A1)
// A1 = parent
// C1 = child

//is function kisi ki upstream se mtlb nhi hai
//iska bs itna kaam h ki parent do and child do , aur mai parent ki downstream se child ko hta dunga
//taki unke bichka connection khtm hojai
//taki agr parent update ho to connection khtm hone ke baad child update na ho

function removeFromDownstream(jismesehtana, jiskohtanahedownstrammese) {
    //jisme se htana he uske downstream lao;

    let jismesehtanadownstream = dataObj[jismesehtana].downstream;

    //jab ham currcelladress ko hta dege tab ye new downstram hogi
    let filteredDownstream = [];

    //yha jho curcelladress ke equal nhi tha usko new filteredDownstream me dala jise jisko htana tha vo usme nhi aya ur automaticallly hat gya
    for (let i = 0; i < jismesehtanadownstream.length; i++) {

        if (jismesehtanadownstream[i] != jiskohtanahedownstrammese) {
            filteredDownstream.push(jismesehtanadownstream[i]);
        }

    }

    //htane ke badh uski new downstream ko  update kiya
    dataObj[jismesehtana].downstream = filteredDownstream;

}

//isko cell milega  jissme formula se reevalute karke us cell ki value ko update karna he

function updateCell(cell) {

    //yha ham jho element doenstram me tha uske object me he

    let cellObj = dataObj[cell];

    //us object me se upstram nikale
    let upstream = cellObj.upstream // [(A1-20), B1-10]

    //uska formula nikala jho evalute ho kar value dege jho badh me updated value banege
    let formula = cellObj.formula // A1 + B1


    // upstream me jobhi cell hai unke objects me jaunga whase unki value lekr aunga 
    // wo sari values mai ek object me key value pair form me store krunga where key being the cell address 

    // {
    //   A1:20,
    //   B1:10
    // }

    //yha ham upstram me jho element he unki value ko valobj me as key value pair store karege
    //valobj me key upstream ka element he aur valobj me value us element ki value 
    let valObj = {};

    for (let i = 0; i < upstream.length; i++) {

        let cellValue = dataObj[upstream[i]].value;
        //upstream[i]->key
        //cellvalue->value of that element in upstream
        valObj[upstream[i]] = cellValue;
    }

    //now hum formula ko reevalute karege 
    //formula me hum value replace kardege 
    //formula A1+B1 WILL BECOME AS "20+10" 
    for (let key in valObj) {
        formula = formula.replace(key, valObj[key]);
    }
    //yha par us formula ko solve kiya aur uski integer vakue nikale
    let newValue = eval(formula); //used to evalute a string expression to integer "2+3" is a string so eval convert it into 2+3 which is 5



    //used to show updated cell value on UI 
    let cellOnUi = document.querySelector(`[data-address='${cell}']`);
    cellOnUi.innerText = newValue;


    //yha par hamene jho value formula se nikale thi usko update bhi karna he 
    dataObj[cell].value = newValue;

    let downstream = cellObj.downstream;

    //after value updation the eleement which was in downstram we go in its upstrem and perfoem value updation 
    //but that element in downstram can also have its own downstram 
    //so we say that downstram to update itself
    for (let i = 0; i < downstream.length; i++) {
        updateCell(downstream[i]);
    }

}

//this function add child to parent's downstream
function addToDownstream(parent, child) {
    // child ko parent ki downstream me add krna hai

    dataObj[parent].downstream.push(child);
}