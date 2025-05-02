function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#img").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$(".switch").click(function () {
  if ($(".url").hasClass("on")) {
    $(".url").removeClass("on");
    $(".btn").addClass("on");
  } else {
    $(".url").addClass("on");
    $(".btn").removeClass("on");
  }
});
$(".sub").click(function () {
  $("#img").attr("src", $(".inpt").val());
  return false;
});
function pcnt(x, name) {
  $(name).html(Math.round(x * 100) + "%");
}
function blr(x) {
  $("#blr").html(x + "px");
}
function hr(x) {
  $("#hr").html(x + "deg");
}
$(document).change(function (e) {
  let brt = $(".brt").val();
  let cnt = $(".cnt").val();
  let gs = $(".gs").val();
  let inv = $(".inv").val();
  let opa = $(".opa").val();
  let sat = $(".sat").val();
  let sep = $(".sep").val();
  let blr = $(".blr").val();
  let hr = $(".hr").val();
  $("img").css(
    "filter",
    "brightness(" +
      brt +
      ") contrast(" +
      cnt +
      ") grayscale(" +
      gs +
      ") invert(" +
      inv +
      ") opacity(" +
      opa +
      ") saturate(" +
      sat +
      ") sepia(" +
      sep +
      ") blur(" +
      blr +
      "px) hue-rotate(" +
      hr +
      "deg)"
  );
});
function zoom(event) {
  event.preventDefault();
  scale += event.deltaY * -0.01;
  scale = Math.min(Math.max(0.125, scale), 2);
  $("#img").css("transform", "scale(" + scale + ")");
}
let scale = 1;
const el = document.querySelector(".left");
el.onwheel = zoom;

$("#restoreBtn").click(function () {
  // Reset filter values to default
  const defaults = {
    brt: 1,
    cnt: 1,
    gs: 0,
    inv: 0,
    opa: 1,
    sat: 1,
    sep: 0,
    blr: 0,
    hr: 0,
  };

  // Update all range sliders and display text
  for (let key in defaults) {
    $("." + key).val(defaults[key]);
    if (key === "blr") {
      $("#" + key).html(defaults[key] + "px");
    } else if (key === "hr") {
      $("#" + key).html(defaults[key] + "deg");
    } else {
      $("#" + key).html(Math.round(defaults[key] * 100) + "%");
    }
  }

  // Reset CSS filter
  $("#img").css("filter", "none");
});

async function getAuth() {
	let res = await fetch("/imagKitauth");
	return res;
  }
  
  document.getElementById("downloadBtn").addEventListener("click", function () {
	const img = document.getElementById("img");
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
  
	const tempImage = new Image();
	tempImage.crossOrigin = "anonymous";
	tempImage.src = img.src;
  
	tempImage.onload = () => {
	  canvas.width = tempImage.naturalWidth;
	  canvas.height = tempImage.naturalHeight;
  
	  // Get filter values
	  let brt = $(".brt").val();
	  let cnt = $(".cnt").val();
	  let gs = $(".gs").val();
	  let inv = $(".inv").val();
	  let opa = $(".opa").val();
	  let sat = $(".sat").val();
	  let sep = $(".sep").val();
	  let blr = $(".blr").val();
	  let hr = $(".hr").val();
  
	  // Apply filters
	  ctx.filter =
		"brightness(" +
		brt +
		") contrast(" +
		cnt +
		") grayscale(" +
		gs +
		") invert(" +
		inv +
		") opacity(" +
		opa +
		") saturate(" +
		sat +
		") sepia(" +
		sep +
		") blur(" +
		blr +
		"px) hue-rotate(" +
		hr +
		"deg)";
  
	  ctx.drawImage(tempImage, 0, 0);
  
	  // Convert canvas to Blob and upload
	  canvas.toBlob((blob) => {
		if (!blob) {
		  console.error("Failed to create blob from canvas");
		  return;
		}
  
		async function handleUpload(blob) {
		  try {
			const authResponse = await getAuth();
			const authData = await authResponse.json();
  
			const imagekit = new ImageKit({
			  publicKey: "public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=",
			  urlEndpoint: "https://ik.imagekit.io/FFSD0037/",
			});
  
			imagekit.upload(
			  {
				file: blob,
				fileName: "filtered-image.jpg",
				tags: ["filtered", "canvas", "upload"],
				responseFields: "tags",
				token: authData.token,
				signature: authData.signature,
				expire: authData.expire,
			  },
			  function (err, result) {
				if (err) {
				  console.log("Upload error:", err);
				} else {
				  console.log("Upload successful:", result.url);
				  // Optional: Set hidden input value or redirect
				  // document.getElementById("profileImageUrl").value = result.url;
				  // document.getElementById("createPostForm").submit();
				}
			  }
			);
		  } catch (error) {
			console.error("Auth or upload failed:", error);
		  }
		}
  
		handleUpload(blob);
	  }, "image/jpeg", 0.95);
	};
  });
  
