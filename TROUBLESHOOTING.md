# Thumbs not visible

### Error message: 
> No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components.

Carousel will find the thumbs if they are rendered as direct children of the carousel or if they are inside a div or another normal html element in a way that it's possible to access the children of these elements from the carousel. 

For performance reasons, it's not possible to get images inside custom components.

Good:
```javascript
<Carousel showArrows={true} showThumbs={true}>
{
    images.map((url, index) => (
        <div key={index}>
           <img src={url} />
           <p>Legend</p>
        </div>
    ))
}
</Carousel>
```

Good:
```javascript
<Carousel showArrows={true} showThumbs={true}>
{
    images.map((url, index) => (
       <img key={index} src={url} />
    ))
}
</Carousel>
```

Bad: 
```javascript
const ImgSlider = ({ url }) => (
    <div>
        <img src={url} />
    </div>
);

<Carousel showArrows={true} showThumbs={true}>
{
    images.map((url, index) => <ImgSlider key={index} url={url}/>)
}
</Carousel>
```
