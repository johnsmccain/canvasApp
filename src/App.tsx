import React, { HtmlHTMLAttributes, useRef, useState } from 'react';
import './app.scss';
// import one from "./assets/one.jpg"
// import two from "./assets/two.jpg"
// import three from "./assets/three.jpg"
// import four from "./assets/four.jpg"
function App() {

  const [name, setName] = useState<string>();
  const [photo, setPhoto] = useState<string>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const generatePhotos = async () => {

    setPhoto("")
    setLoading(true)

    let i:number = 4;
    let temp: string[] = []

    // Generate 4 images from API
    while (i){
      let res = await fetch("https://source.unsplash.com/random/300x300");
      temp.push(res.url);
      i--
    }

    setPhotos(temp)
    setLoading(false)
    // setPhotos([one, two, three, four]);
  }

  const savePhoto = async () => {
    
    const a = document.createElement("a");
    const canvas = document.createElement("canvas");
    const previewImg:any = document.querySelector(".preview-img");

    let newImg = new Image();
    let ctx:any = canvas.getContext("2d");

    /**
     * Setting crossOrigin to anonymous on newImg
     * in order to clear the error ("Uncaught SecurityError: 
     * Failed to execute 'toDataURL' on 'HTMLCanvasElement': 
     * Tainted canvases may not be exported.")
     */
    newImg.src = previewImg.src
    newImg.crossOrigin="anonymous"
    // set canvas width and hight
    canvas.width = previewImg?.clientWidth;
    canvas.height = previewImg?.clientHeight;
    newImg.onload = function () {//wait for the photo to load before running this function

      // drawing user selected image onto the canvas
      ctx?.drawImage(newImg, 0, 0, canvas.width, canvas.height);
      
      // styling canvas text
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "30px sans-serif";

      // writing text onto the canvas
      ctx.fillText(name, canvas.width/2, canvas.height -50);
      ctx.fillText("THANK YOU", canvas.width/2, canvas.height/7);
  
      // passing canvas data url as href value of <a> element
      a.href = canvas.toDataURL("image/jpg", 1.0); // load jpg in full quality
      a.download = `${name}-${Date.now()}`; // create a unique/random name
      a.click();
    }
    
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className={`${loading ? "overlay" : "hide" }`}>
          <div className="overlay-spinner"></div>
        </div>
        <div className="wrapper-box">
            {
              photo? 
                <div className="preview">
                  <div className="preview-text">
                    <p className="top text">Thank You</p>
                    <p className="bottom text">{name}</p>
                  </div>
                  <img className='preview-img' src={photo} alt="gift card" />
                </div>
              : photos.length > 0 ? 
                <div className='images'>
                  {photos.map((img, i) => <img key={i} onClick={() => setPhoto(img)} src={img} alt="random"/>)}
                </div>
              : 
                <>
                  <p className='text init'>
                    {
                      loading ?
                        "Loading..."
                      :
                        "Oops, click to generate new photos"
                    }
                  </p>
                  <button 
                    onClick={generatePhotos}
                    disabled={loading}
                  >
                      {!loading ? "Generate" : "Please Wait"}
                  </button>
                </>
            } 
        </div>
        { photo && <div className="row">
          <button onClick={generatePhotos} className="col reset btn">Reset</button>
          <input type="text" className="caption col" placeholder='Name here...' onChange={(e)=> setName(e.target.value)}/>
          <button onClick={savePhoto}  className='download btn col'>
            download
          </button>
        </div>}
    </div>
    <footer>
      <a className='footer link' href="https://github.com/johnsmccain/ASSETSMENT" target="_blank" rel="noopener noreferrer">Source Code</a>
    </footer>
  </div>
)}
export default App
