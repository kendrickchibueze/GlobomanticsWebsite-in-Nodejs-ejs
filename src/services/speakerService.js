
//we are using a third party APi called speakers

const axios =require('axios');



function speakerService(){
   function getSpeakerById(id){
      //call data from a third party Api
      return new Promise((resolve, reject) => {
         axios.get('http://localhost:3000/speakers/' + id)
            .then((response) => {
               resolve(response);
      })
      .catch((err) => {
         reject(err);
      })
})

   }
return {getSpeakerById}
}



module.exports = speakerService();