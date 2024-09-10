google.charts.load("current", {
    packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);
 
///// แสดงตารางเริ่มต้น
function loadTable() {
    const xhttp = new XMLHttpRequest();
    const uri = "http://localhost:3000/slist";
    xhttp.open("GET", uri);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = "";
            var num = 1;
            const objects = JSON.parse(this.responseText);
            console.log(objects);
  
        for (let object of objects) {
          trHTML += "<tr>";
          trHTML += "<td>" + num + "</td>";
          trHTML += "<td>" + object["productid"] + "</td>";
          trHTML += "<td>" + object["productname"] + "</td>";
          trHTML += "<td>" + object["category"] + "</td>";
          trHTML += "<td>" + object["discountedprice"] + "</td>";
          trHTML += "<td>" + object["actualprice"] + "</td>";
          trHTML += "<td>" + object["discountpercentage"] + "</td>";
          trHTML += "<td>" + object["rating"] + "</td>";
          trHTML += "<td>";
          trHTML +='<a type="button" class="btn btn-outline-secondary me-2" onclick="showStudentUpdateBox(\'' +object["_id"] +'\')"><i class="fas fa-edit"></i></a>';
          trHTML +='<a type="button" class="btn btn-outline-danger" onclick="showStudentDeleteBox(\'' +object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
          trHTML += "<tr>";
  
          num++;
        }
        document.getElementById("mytable").innerHTML = trHTML;
  
        loadGraph(objects);
      }
    };
}

//// สร้างข้อมูลใหม่

function showStudentCreateBox() {
    var d = new Date();
    const date = d.toISOString().split("T")[0];
  
    Swal.fire({
      title: "Create Student Transaction",
      html:
        '<div class="mb-3"><label for="Created_Date" class="form-label">Created Date</label>' +
        '<input id="Created_Date" class="swal2-input" placeholder="Created_Date" type="hidden" value="' + date +'">' +
  
        '<div class="mb-3"><label for="productid" class="form-label">productid</label>' +
        '<input class="form-control" id="productid" placeholder="productid"></div>' +
  
        '<div class="mb-3"><label for="productname" class="form-label">productname</label>' +
        '<input class="form-control" id="productname" placeholder="productname"></div>' +
  
        '<div class="mb-3"><label for="children" class="form-label">category</label>' +
        '<input class="form-control" id="category" placeholder="category"></div>' +
        
        '<div class="mb-3"><label for="discountedprice" class="form-label">discountedprice</label>' +
        '<input class="form-control" id="discountedprice" placeholder="discountedprice"></div>' +

        '<div class="mb-3"><label for="actualprice" class="form-label">actualprice</label>' +
        '<input class="form-control" id="actualprice" placeholder="actualprice"></div>' +
  
        '<div class="mb-3"><label for="discountpercentage" class="form-label">discountpercentage</label>' +
        '<input class="form-control" id="discount percentage" placeholder="discount percentage"></div>' +
  
        '<div class="mb-3"><label for="rating" class="form-label">rating</label>' +
        '<input class="form-control" id="rating" placeholder="ratings"></div>',
  
      focusConfirm: false,
      preConfirm: () => {
        slistCreate();
      },
    });
  }
  
  function slistCreate() {
    const Created_Date = document.getElementById("Created_Date").value;
    const productid = document.getElementById("productid").value;
    const productname = document.getElementById("productname").value;
    const category = document.getElementById("category").value;
    const discountedprice = document.getElementById("discountedprice").value;
    const actualprice = document.getElementById("actualprice").value;
    const discountpercentage = document.getElementById("discountpercentage").value;
    const rating = document.getElementById("rating").value;
  
    console.log(
      JSON.stringify({
        Created_Date: Created_Date,
        productid: productid,
        productname: productname,
        category: category,
        discountedprice: discountedprice,
        actualprice : actualprice,
        discountpercentage: discountpercentage,
        rating: rating,
      })
    );
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/slist/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        Created_Date: Created_Date,
        productid: productid,
        productname: productname,
        category: category,
        discountedprice: discountedprice,
        actualprice: actualprice,
        discountpercentage: discountpercentage,
        rating: rating,
      })
    );
  
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(
          "Good job!",
          "Create Student Information Successfully!",
          "success"
        );
        loadTable();
      }
    };
  }

  //////  การลบข้อมูล

  function showStudentDeleteBox(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        studentDelete(id);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  
  }
  
  function studentDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/slist/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        _id: id,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(
          "Good job!",
          "Delete Student Information Successfully!",
          "success"
        );
        loadTable();
      }
    };
  }

  ///// การอัปเดตแก้ไขข้อมูล

  function showStudentUpdateBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/slist/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const object = JSON.parse(this.responseText).Complaint;
        console.log("showStudentUpdateBox", object);
        Swal.fire({
          title: "Update Student Transaction",
          html:
            '<input id="id" class="swal2-input" placeholder="OID" type="hidden" value="' +object["_id"] +'"><br>' +
            '<div class="mb-3"><label for="Created_Date" class="form-label">Created Date</label>' +
            '<input class="form-control" disabled id="Created_Date" placeholder="Created_Date" value="' +object["Created_Date"] +'"></div>' +
  
            '<div class="mb-3"><label for="productid" class="form-label">productid</label>' +
            '<input class="form-control" id="productid" placeholder="productid" value="' +object["productid"] +'"></div>' +
  
            '<div class="mb-3"><label for="productname" class="form-label">productname</label>' +
            '<input class="form-control" id="productname" placeholder="productname" value="' +object["productname"] +'"></div>' +
            
            '<div class="mb-3"><label for="category" class="form-label">category</label>' +
            '<input class="form-control" id="category" placeholder="category" value="' +object["category"] +'"></div>' +
  
            '<div class="mb-3"><label for="discountedprice" class="form-label">discountedprice</label>' +
            '<input class="form-control" id="discountedprice" placeholder="discountedprice" value="' +object["discountedprice"] +'"></div>' +
  
            '<div class="mb-3"><label for="actualprice" class="form-label">actualprice</label>' +
            '<input class="form-control" id="actualprice" placeholder="actualprice" value="' +object["actualprice"] +'"></div>' +
  
            '<div class="mb-3"><label for="discountpercentage" class="form-label">discountpercentage</label>' +
            '<input class="form-control" id="discountpercentage" placeholder="discountpercentage" value="' +object["discountpercentage"] +'"></div>' +
  
            '<div class="mb-3"><label for="rating" class="form-label">rating</label>' +
            '<input class="form-control" id="rating" placeholder="rating" value="' +object["rating"] +'"></div>',

          focusConfirm: false,
          preConfirm: () => {
            studentUpdate();
          },
        });
      }
    };
  }
  
  function studentUpdate() {
    const id = document.getElementById("id").value;
    const Created_Date = document.getElementById("Created_Date").value;
    const productid = document.getElementById("productid").value;
    const productname = document.getElementById("productname").value;
    const category = document.getElementById("category").value;
    const discountedprice = document.getElementById("discountedprice").value;
    const actualprice = document.getElementById("actualprice").value;
    const discountpercentage = document.getElementById("discountpercentage").value;
    const ratingrating = document.getElementById("ratingrating").value;
  
    console.log(
      JSON.stringify({
        _id : id,
        Created_Date: Created_Date,
        productid: productid,
        productname: productname,
        category: category,
        discountedprice: discountedprice,
        actualprice: actualprice,
        discountpercentage: discountpercentage,
        ratingrating: ratingrating,
      })
    );
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/slist/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        _id: id,
        Created_Date: Created_Date,
        productid: productid,
        productname: productname,
        category: category,
        discountedprice: discountedprice,
        actualprice:actualprice,
        discountpercentage: discountpercentage,
        rating: rating,
      })
    );
  
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(
          "Good job!",
          "Update Student Information Successfully!",
          "success"
        );
        loadTable();
      }
    };
  }

///// เสริชข้อมูล

  function loadQueryTable() {
    document.getElementById("mytable").innerHTML ='<tr><th scope="row" colspan="5">Loading...</th></tr>';
    const searchText = document.getElementById("searchTextBox").value;
    if(searchText=="") {
      loadTable();
    } else{

      const xhttp = new XMLHttpRequest();
      const uri = "http://localhost:3000/slist/field/" + searchText;
      xhttp.open("GET", uri);
    
      xhttp.send();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var trHTML = "";
          var num = 1;
          const objects = JSON.parse(this.responseText).Complaint;
          for (let object of objects) {
            trHTML += "<tr>";
            trHTML += "<td>" + num + "</td>";
            trHTML += "<td>" + object["productid"] + "</td>";
            trHTML += "<td>" + object["productname"] + "</td>";
            trHTML += "<td>" + object["category"] + "</td>";
            trHTML += "<td>" + object["discountedprice"] + "</td>";
            trHTML += "<td>" + object["actualprice"] + "</td>";
            trHTML += "<td>" + object["discountpercentage"] + "</td>";
            trHTML += "<td>" + object["rating"] + "</td>";
            trHTML += "<td>";
            trHTML +='<a type="button" class="btn btn-outline-secondary me-2" onclick="showStudentUpdateBox(\'' +object["_id"] +'\')"><i class="fas fa-edit"></i></a>';
            trHTML +='<a type="button" class="btn btn-outline-danger" onclick="showStudentDeleteBox(\'' +object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
            trHTML += "<tr>";
            num++;
          }
          console.log(trHTML);
          document.getElementById("mytable").innerHTML = trHTML;
    
        }
    }
    };
  }

//////

function loadGraph(objects) {
  var hotelCount = 0;
  var resorthotelCount = 0;
  
  for (let object of objects) {
    switch (object["hotel"]) {
      case "City Hotel":
        hotelCount = hotelCount + 1;
      break;
  
      case "Resort Hotel":
        resorthotelCount = resorthotelCount + 1;
      break;
    }}
  
  var TimelyResponseData = google.visualization.arrayToDataTable([
    ["hotel", "Field"],
    ["City Hotel",hotelCount],
    ["Resort Hotel",resorthotelCount],
  ]);
  
  var optionsTimelyResponse = { 
    title: "Classification of Amazon",
    legentFontSize: 15,
    fontSize: 15,
    titleFontSize: 15,
    tooltipFontSize: 15 };

  var chartTimelyResponse = new google.visualization.PieChart(document.getElementById("piechartTimelyResponse"));
  chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);
}