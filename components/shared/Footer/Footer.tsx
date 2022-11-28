import f from  "./Footer.module.css"


const Footer = () => {
  return (
    <div className="h-8 text-white text-sm bg-gray-light flex  gap-4 place-content-between px-7 items-center">
      <div className="flex flex-row mobile:flex-wrap gap-3">
        <p>&#169; splitscreen.com 2022</p>
        <p>powered by Steam &#8482;</p>
      </div>
      <div className="flex flex-row mobile:flex-wrap gap-3">
        <p>&#169; splitscreen.com 2022</p>
        <p>powered by Steam &#8482;</p>
       </div>
      </div>
  )
};

export default Footer;
