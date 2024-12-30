import { useMainContext } from "./context/MainContext";

const handleCreateProject = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const url = formData.get('url')
    const name  =formData.get('name');
    const description = formData.get('description');

    try {
      const res = await fetch(process.env.BASE_URL,{
        method : 'POST',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json'
        },
        body : JSON.stringify(project)
      })

      if (res.ok) {
          
      }
    }catch(err){
      console.log(err);
    }

}