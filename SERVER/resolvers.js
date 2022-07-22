
export default{
    Query:{
        get: (parent,{key},{client})=>{
            try {
                return client.getAsync(key);
            } catch (error) {
                return null;
            }
        }
    },
    Mutation:{
        set:async(parent,{key,value},{client})=>{
            try {
                client.set(key,value);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }   
        }
    }
}