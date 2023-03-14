function validateParams(params : Record<string,any>, schema:Record<string,any>):boolean{
    const schemaKeys = Object.keys(schema);
    const paramKeys = Object.keys(params);

    /** params에 포함되지 않은 property가 발견되었을 때 */
    for(const paramKey of paramKeys){
        if(!schemaKeys.includes(paramKey)){
            throw new Error(`Invalid param key : ${paramKey}`);
        }
    }
    return true;
}

export default validateParams;