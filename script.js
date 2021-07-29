let inputWhere = null;
let inputHowMuch = null;
let varWhere = "";
let varHowMuch = "";
let buttonAdd = null;
let content = null;
let container = null;
let finalcost = 0;
let input1 = null;
let input2 = null;
let input3 = null;
let indexCost = null;
let outlay = [];

const changeOne = {
  index: null,
  first: false,
  second: false,
  third: false,
};

const newSpend = {
  index: null,
  where: null,
  date: null,
  howMuch: null,
};

window.onload = async () => {
  inputWhere = document.getElementById("where-spend");
  inputHowMuch = document.getElementById("how-much");
  buttonAdd = document.getElementById("add-spend");
  const response = await fetch("http://localhost:8080/get", {
    method: "GET",
  });

  const result = await response.json();
  outlay = result.costs;
  inputWhere.addEventListener("change", writeWhere);
  inputHowMuch.addEventListener("change", writeHowMuch);
  buttonAdd.addEventListener("click", addCost);
  render();
};

const writeWhere = (event) => (varWhere = event.target.value);

const writeHowMuch = (event) => (varHowMuch = event.target.value);

const addCost = async (event) => {
  if (varWhere.length != 0 && varHowMuch.length != 0) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = dd + "." + mm + "." + yyyy;
    const response = await fetch("http://localhost:8080/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        where: varWhere,
        date: today,
        howMuch: varHowMuch,
      }),
    });

    const result = await response.json();
    outlay = result.costs;
    inputWhere.value = "";
    inputHowMuch.value = "";
    varWhere = "";
    varHowMuch = "";
    render();
  } else {
    alert("Введённые значения не корректны");
  }
};

const render = () => {
  finalcost = 0;
  content = document.getElementById("list-spend");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  outlay.map((item, index) => {
    container = document.createElement("div");
    container.id = `spend ${index}`;
    const num = document.createElement("p");
    num.innerText = `${index + 1})`;
    const textWhere = document.createElement("p");
    textWhere.innerText = item.where;
    textWhere.addEventListener("dblclick", (e) => funcWhere(e, index));
    const textDate = document.createElement("p");
    textDate.innerText = item.date;
    textDate.addEventListener("dblclick", (e) => funcDate(e, index));
    const textHowMuch = document.createElement("p");
    textHowMuch.innerText = item.howMuch;
    textHowMuch.addEventListener("dblclick", (e) => funcHowMuch(e, index));
    const textRubl = document.createElement("p");
    textRubl.innerText = "р.";
    const imgDel = document.createElement("img");
    imgDel.src = "icons8-trash.svg";
    imgDel.onclick = () => {
      funcDel(index);
    };

    const imgEdit = document.createElement("img");
    imgEdit.src = "icons8-edit-64.png";
    const imgSave = document.createElement("img");
    imgSave.src = "icons8-ок.svg";
    imgSave.onclick = () => {
      funcSave(index);
    };

    const imgCancel = document.createElement("img");
    imgCancel.src = "icons8-delete-64.png";
    imgCancel.onclick = () => {
      funcCancel(index);
    };

    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");
    const div4 = document.createElement("div");
    input1 = document.createElement("input");
    input2 = document.createElement("input");
    input3 = document.createElement("input");

    div1.appendChild(num);
    if (index === changeOne.index) {
      changeOne.index = null;
      if (changeOne.first) {
        input1.autofocus = true;
        input1.type = "text";
        input1.value = item.where;
        changeOne.first = !changeOne.first;
        input1.selectionStart = input1.value.length;
        div1.appendChild(input1);
        input1.addEventListener("blur", (e) => funcinput1(e, index));
      } else {
        div1.appendChild(textWhere);
      }

      if (changeOne.second) {
        input2.autofocus = true;
        input2.type = "text";
        input2.value = item.date;
        changeOne.second = !changeOne.second;
        input2.selectionStart = input2.value.length;
        div2.appendChild(input2);
        input2.addEventListener("blur", (e) => funcinput2(e, index));
      } else {
        div2.appendChild(textDate);
      }

      if (changeOne.third) {
        input3.autofocus = true;
        changeOne.third = !changeOne.third;
        input3.type = "number";
        input3.value = item.howMuch;
        div3.appendChild(input3);
        input3.addEventListener("blur", (e) => funcinput3(e, index));
      } else {
        div3.appendChild(textHowMuch);
      }

      div4.appendChild(imgEdit);
      div4.appendChild(imgDel);
    } else {
      if (index === indexCost) {
        input1.autofocus = true;
        input2.autofocus = true;
        input3.autofocus = true;
        input1.type = "text";
        input2.type = "text";
        input3.type = "number";
        input1.value = item.where;
        input2.value = item.date;
        input3.value = item.howMuch;
        newSpend.index = index;
        indexCost = null;
        input1.selectionStart = input1.value.length;
        input2.selectionStart = input2.value.length;
        div1.appendChild(input1);
        div2.appendChild(input2);
        div3.appendChild(input3);
        div4.appendChild(imgSave);
        div4.appendChild(imgCancel);
        input1.addEventListener("change", (e) => funcinput1all(e, index));
        input2.addEventListener("change", (e) => funcinput2all(e, index));
        input3.addEventListener("change", (e) => funcinput3all(e, index));
      } else {
        div1.appendChild(textWhere);
        div2.appendChild(textDate);
        div3.appendChild(textHowMuch);
        div4.appendChild(imgEdit);
        div4.appendChild(imgDel);
      }
    }

    div3.appendChild(textRubl);
    container.appendChild(div1);
    container.appendChild(div2);
    container.appendChild(div3);
    container.appendChild(div4);
    content.appendChild(container);
    imgEdit.addEventListener("click", (e) => funcEdit(e, index));
  });

  finalcost = outlay.reduce((final, next) => final + +next.howMuch, finalcost);
  const textFinalCost = document.getElementById("cost");
  textFinalCost.innerText = `${finalcost} р.`;
};

const funcSave = async (index) => {
  let { _id } = outlay[index];
  if (!newSpend.where) {
    newSpend.where = outlay[index].where;
  }

  if (!newSpend.date) {
    newSpend.date = outlay[index].date;
  }

  if (!newSpend.howMuch) {
    newSpend.howMuch = outlay[index].howMuch;
  }

  if (
    newSpend.where.length !== 0 &&
    newSpend.date.length !== 0 &&
    newSpend.howMuch.length !== 0
  ) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        where: newSpend.where,
        date: newSpend.date,
        howMuch: newSpend.howMuch,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }

  render();
};

const funcCancel = (index) => {
  newSpend.index = null;
  newSpend.where = null;
  newSpend.date = null;
  newSpend.howMuch = null;
  render();
};

const funcDel = async (index) => {
  const response = await fetch(
    `http://localhost:8080/del?id=${outlay[index]._id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();
  outlay = result.costs;
  render();
};

const funcEdit = (event, index) => {
  indexCost = index;
  render();
};

const funcWhere = (event, index) => {
  changeOne.index = index;
  changeOne.first = !changeOne.first;
  render();
};

const funcDate = (event, index) => {
  changeOne.index = index;
  changeOne.second = !changeOne.second;
  render();
};

const funcHowMuch = (event, index) => {
  changeOne.index = index;
  changeOne.third = !changeOne.third;
  render();
};

const funcinput1 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        where: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }

  render();
};

const funcinput2 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        date: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }

  render();
};

const funcinput3 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        howMuch: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }

  render();
};

const funcinput1all = (event, index) => (newSpend.where = event.target.value);

const funcinput2all = (event, index) => (newSpend.date = event.target.value);

const funcinput3all = (event, index) => (newSpend.howMuch = event.target.value);
