function toggleList() {
    var list = document.getElementById("myList");
    var triangle = document.querySelector(".triangle");

    // Toggle list visibility
    if (list.style.display === "none" || !list.style.display) {
        list.style.display = "block";
        list.classList.add("visible");
    } else {
        list.style.display = "none";
        list.classList.remove("visible");
    }

    // Toggle triangle rotation
    triangle.classList.toggle("active");
}
