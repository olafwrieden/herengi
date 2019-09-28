function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("itemInput").value;
    inputValue + ": " + document.getElementById("inputPrice").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
      alert("You must write something!");
    } else {
      document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

}