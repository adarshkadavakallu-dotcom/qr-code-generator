/* =====================================
   GET HTML ELEMENTS
===================================== */

const input =
    document.getElementById("qrInput");

const qrSize =
    document.getElementById("qrSize");

const qrColor =
    document.getElementById("qrColor");

const bgColor =
    document.getElementById("bgColor");

const generateBtn =
    document.getElementById("generateBtn");

const clearBtn =
    document.getElementById("clearBtn");

const qrSection =
    document.getElementById("qrSection");

const qrContainer =
    document.getElementById("qrContainer");

const downloadBtn =
    document.getElementById("downloadBtn");

const copyBtn =
    document.getElementById("copyBtn");

const statusMessage =
    document.getElementById("statusMessage");


/* =====================================
   QR CODE VARIABLE
===================================== */

let qrCode = null;


/* =====================================
   SHOW STATUS
===================================== */

function showStatus(message) {

    statusMessage.textContent =
        message;
}


/* =====================================
   GENERATE QR CODE
===================================== */

function generateQRCode() {

    /*
        Get the user's input
    */

    const text =
        input.value.trim();


    /*
        Check for empty input
    */

    if (text === "") {

        qrSection.style.display =
            "none";

        showStatus(
            "Please enter text or a URL."
        );

        input.focus();

        return;
    }


    /*
        Check whether QR library loaded
    */

    if (typeof QRCode === "undefined") {

        showStatus(
            "QR Code library could not be loaded. Check your internet connection."
        );

        return;
    }


    /*
        Get selected size
    */

    const size =
        Number(qrSize.value);


    /*
        Remove previous QR code
    */

    qrContainer.innerHTML = "";


    /*
        Create new QR code
    */

    qrCode =
        new QRCode(
            qrContainer,
            {
                text: text,

                width: size,

                height: size,

                colorDark:
                    qrColor.value,

                colorLight:
                    bgColor.value,

                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );


    /*
        Show result section
    */

    qrSection.style.display =
        "block";


    /*
        Show success message
    */

    showStatus(
        "QR code generated successfully."
    );
}


/* =====================================
   GENERATE BUTTON
===================================== */

generateBtn.addEventListener(
    "click",
    generateQRCode
);


/* =====================================
   ENTER KEY
===================================== */

input.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            generateQRCode();
        }
    }
);


/* =====================================
   DOWNLOAD QR CODE
===================================== */

downloadBtn.addEventListener(
    "click",
    function () {

        /*
            Find generated canvas
        */

        const canvas =
            qrContainer.querySelector(
                "canvas"
            );


        /*
            Find generated image
        */

        const image =
            qrContainer.querySelector(
                "img"
            );


        let downloadURL =
            null;


        /*
            Canvas download
        */

        if (canvas) {

            downloadURL =
                canvas.toDataURL(
                    "image/png"
                );
        }


        /*
            Image download
        */

        else if (image) {

            downloadURL =
                image.src;
        }


        /*
            No QR available
        */

        else {

            showStatus(
                "Generate a QR code before downloading."
            );

            return;
        }


        /*
            Create temporary download link
        */

        const downloadLink =
            document.createElement(
                "a"
            );


        downloadLink.download =
            "qr-code.png";


        downloadLink.href =
            downloadURL;


        document.body.appendChild(
            downloadLink
        );


        downloadLink.click();


        document.body.removeChild(
            downloadLink
        );


        showStatus(
            "QR code downloaded successfully."
        );
    }
);


/* =====================================
   COPY QR CODE
===================================== */

copyBtn.addEventListener(
    "click",
    async function () {

        /*
            Find generated canvas
        */

        const canvas =
            qrContainer.querySelector(
                "canvas"
            );


        /*
            Find generated image
        */

        const image =
            qrContainer.querySelector(
                "img"
            );


        /*
            Browser must support
            Clipboard API
        */

        if (
            !navigator.clipboard ||
            !window.ClipboardItem
        ) {

            showStatus(
                "Copy is not supported in this browser. Use Download PNG instead."
            );

            return;
        }


        try {

            let blob;


            /*
                Convert canvas to image
            */

            if (canvas) {

                blob =
                    await new Promise(
                        function (resolve) {

                            canvas.toBlob(
                                resolve,
                                "image/png"
                            );
                        }
                    );
            }


            /*
                Convert image to blob
            */

            else if (image) {

                const response =
                    await fetch(
                        image.src
                    );

                blob =
                    await response.blob();
            }


            /*
                No QR exists
            */

            else {

                showStatus(
                    "Generate a QR code before copying."
                );

                return;
            }


            /*
                Copy image to clipboard
            */

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": blob
                })
            ]);


            showStatus(
                "QR code copied to clipboard."
            );

        }

        catch (error) {

            console.error(
                "Copy error:",
                error
            );

            showStatus(
                "Could not copy the QR code. Use Download PNG instead."
            );
        }

    }
);


/* =====================================
   CLEAR EVERYTHING
===================================== */

clearBtn.addEventListener(
    "click",
    function () {

        /*
            Clear input
        */

        input.value = "";


        /*
            Remove QR
        */

        qrContainer.innerHTML = "";


        /*
            Hide result
        */

        qrSection.style.display =
            "none";


        /*
            Clear status
        */

        showStatus("");


        /*
            Reset QR variable
        */

        qrCode = null;


        /*
            Put cursor back in input
        */

        input.focus();
    }
);


/* =====================================
   INITIAL STATE
===================================== */

input.focus();