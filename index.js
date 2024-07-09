document.addEventListener("DOMContentLoaded", async () => {
    let body = document.querySelector(".body");
    let popUp = document.querySelector(".pop_up");
     
    let closeButton = document.querySelector(".close_button");

    let radioItem = document.querySelectorAll(".radio");
    let popUpRadio = document.querySelectorAll(".pop_up-tarif");
    let baseObject = {};


    function Timer(minutes, seconds, timeout) {
        if(Number(minutes.textContent) === 0 && Number(seconds.textContent) === 0){
            clearInterval(timeout)

            document.querySelectorAll(".radio").forEach((item) => {
                let oldPrice =item.querySelector('.old-price-marker');
                let newPrice = item.querySelector('.new-price-marker');
                item.querySelector('.dicsount-icon').style.display = "none"
            if(item.classList.contains("horizont_form-item")) {
                
            }
            newPrice.style.position = 'absolute';
            oldPrice.style.position = 'relative';
            oldPrice.style.bottom = "0";
            newPrice.style.animation = "fontTRansition 1.2s linear forwards";
            oldPrice.style.animation = "old-price-transition 1.2s linear forwards";
            setTimeout(() => {
                newPrice.classList.add("hidden");
            },1200)
            })

            setTimeout(() => {
                body.style.setProperty('--after-display', 'block');

            popUp.classList.toggle("hidden")
            setTimeout(() => {
                popUp.classList.toggle("change")
                body.style.setProperty('--after-opacity', '1');
            }, 100)
            }, 2000)


            radioItem.forEach((element,index) => {
                element.previousElementSibling.value = `${baseObject.normal[index].name} : ${baseObject.normal[index].price}₽ `;
            })

            return;
            
        }
        if(Number(seconds.textContent) === 0)  {
            seconds.textContent = "59"
            if(Number(minutes.textContent) <= 10) {
                minutes.textContent ='0' + (Number(minutes.textContent) -1);
            } else {
                minutes.textContent = Number(minutes.textContent) -1;
            }
        } else {
            if(Number(seconds.textContent) <= 30 && Number(minutes.textContent) === 0){
                minutes.style.color = "#FD4D35";
                seconds.style.color = "#FD4D35";

                document.querySelectorAll(".colon").forEach((item) => {
                    item.style.backgroundColor = "rgb(253, 77, 53)"
                })

                document.querySelector(".policy").setAttribute("checked", "checked");
            }
            if(Number(seconds.textContent) <= 10) {
                seconds.textContent ='0' + (Number(seconds.textContent) -1);
            } else {
                seconds.textContent = Number(seconds.textContent) -1;
            }
        }
    }

    let minute = document.querySelector('.minute');
    let second = document.querySelector('.second');

    minute.textContent = "02";
    second.textContent = "00";

    let interval = setInterval(() => Timer(minute, second,interval), 1000);
    let isAnimating = false

    body.addEventListener('click', (e) => {
        if ((e.target.closest(".pop_up") === null) && (!popUp.classList.contains("hidden")) || (e.target === closeButton)) {
        
                if(isAnimating) {
                    return
                }
                
                isAnimating = true;
                popUp.classList.toggle("change");
                body.style.setProperty('--after-opacity', '0');
                
                setTimeout(() => {
                    body.style.setProperty('--after-display', 'none');
                    popUp.classList.toggle("hidden");
                    isAnimating = false;
                }, 1000);
       
        }
    })


    await fetch("https://t-pay.iqfit.app/subscribe/list-test")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(item => {
            if (item.isPopular) {
                if (baseObject.hasOwnProperty("isPopular")) {
                    baseObject.isPopular.push({ "name": item.name, "price": item.price });
                } else {
                    baseObject.isPopular = [{ "name": item.name, "price": item.price }];
                }
            } else if (item.isDiscount) {
                if (baseObject.hasOwnProperty("isDiscount")) {
                    baseObject.isDiscount.push({ "name": item.name, "price": item.price });
                } else {
                    baseObject.isDiscount = [{ "name": item.name, "price": item.price }];
                }
            } else {
                if (baseObject.hasOwnProperty('normal')) {
                    baseObject.normal.push({ "name": item.name, "price": item.price });
                } else {
                    baseObject.normal = [{ "name": item.name, "price": item.price }];
                }
            }
        });
    })
    .catch(error => {
        console.error("There was an error fetching the data:", error);
    });
       

        radioItem.forEach((element,index) => {
            element.querySelector(".title-marker").textContent = baseObject.normal[index].name;
            element.querySelector(".old-price-marker").textContent = baseObject.normal[index].price + "₽";

            element.querySelector(".new-price-marker").textContent = baseObject.isPopular[index].price + "₽";

            element.previousElementSibling.value = `${baseObject.normal[index].name} : ${baseObject.isPopular[index].price}₽ `;
        })

        popUpRadio.forEach((element, index) => {
            element.querySelector(".title-marker").textContent = baseObject.normal[index].name
            element.querySelector(".old-price-marker").textContent = baseObject.normal[index].price + "₽"

            element.querySelector(".new-price-marker").textContent = baseObject.isDiscount[index].price + "₽"

            element.previousElementSibling.value = `${baseObject.normal[index].name} : ${baseObject.isDiscount[index].price}₽`;
        })
})
