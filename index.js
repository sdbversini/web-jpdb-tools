document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mokuro');
  form.addEventListener('submit', (e) => {
    const file = e.target[0].files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      var el = document.createElement('html');
      el.innerHTML = event.target.result;
      const pages = el.querySelectorAll("#pagesContainer .page");
      const strings = Array.from(pages).map((page) => {
        let textboxes = Array.from(page.querySelectorAll(".textBox"));
        return textboxes.map((textbox) => {
          return Array.from(textbox.querySelectorAll("p")).map(e => e.innerText).join();
        }).join("\n");
      }).join("\n");
      console.log(strings);
    });
    fileReader.readAsText(file);
    e.preventDefault();
  });
});
