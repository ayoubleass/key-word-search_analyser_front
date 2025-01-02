
export const handleCreateProject = async ( project, token, setToken) => {
    
    try {
      const res = await fetch('http://localhost:3000/api/v1/projects',{
        method : 'POST',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json',
          'X-Token': token,
        },
        body : JSON.stringify(project)
      })
      const data = await res.json();
      if (res.ok) {
        return data; 
      }else {
        setToken('');
      }
    }catch(err){
      console.log(err);
    }
}



export const handleCreateResults = async (results, projectId, token) => {
   try {
    const res = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`,{
        method : 'POST',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json',
          'X-Token': token,
        },
        body : JSON.stringify(results)
    })
    const newResults = await res.json();
    if (res.ok){
      return newResults;
    }else{
      return [];
    }
  }catch (err) {
    console.log(err);
  }

}



