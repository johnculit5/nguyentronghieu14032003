let search = document.querySelector(".search");
        let clear = document.querySelector(".clear");

        search.onclick = function () {
            document.querySelector(".container-search").classList.toggle('active');
        }

        clear.onclick = function () {
            document.getElementById("search").value = "";
        }