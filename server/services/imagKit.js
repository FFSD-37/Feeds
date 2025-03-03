import ImageKit from "imagekit";

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/FFSD0037/',
  publicKey: 'public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=',
  privateKey: 'private_2wDdfNX21sEy937VZ2Vqbm1v+PE='
});

const handleimagKitauth=(req,res)=>{
    try {
        // console.log(req.body);
        
        
    const authParams = imagekit.getAuthenticationParameters();
    return res.json(authParams);
    } catch (error) {
        throw new Error(error);
    }
}

export {handleimagKitauth}