class MissingDTO{
    constructor(user){
        this._id = user._id;
        this.person_name = user.person_name; 
        this.gaurdian_name = user.gaurdian_name; 
        this.missing_date = user.missing_date;
        this.age = user.age; 
        this.religion = user.religion; 
        this.gender = user.gender;
        this.IdProof = user.IdProof; 
        this.missing_location = user.missing_location;  
        this.contact = user.contact;
        this.missing_image = user.missing_image;
        this.gaurdian_id = user.gaurdian_id;
    }
}

module.exports = MissingDTO;