import { BACKEND_URL } from "../config.js"

class User {
  #id = undefined
  #email = undefined
  #role = undefined
  #token = undefined
  #fullname = undefined
  #contact_email = undefined
  #contact_phone = undefined
  #location = undefined
  #services = undefined
  #about_you = undefined
  #experience = undefined
  #hourly_rate = undefined
  #about_experience = undefined
  #skills = undefined

  constructor() {
    const userFromStorage = sessionStorage.getItem('user')
    if (userFromStorage) {
      const userObject = JSON.parse(userFromStorage)
      this.#id = userObject.id
      this.#email = userObject.email
      this.#role = userObject.role
      this.#token = userObject.token
      this.#fullname = userObject.fullname
      this.#contact_email = userObject.contact_email
      this.#contact_phone = userObject.contact_phone
      this.#location = userObject.location
      this.#services = userObject.services
      this.#about_you = userObject.about_you
      this.#experience = userObject.experience
      this.#hourly_rate = userObject.hourly_rate
      this.#about_experience = userObject.about_experience
      this.#skills = userObject.skills
    }
  }

  get id() {
    return this.#id
  }

  get email() {
    return this.#email
  }

  get role() {
    return this.#role
  }

  get token() {
    return this.#token
  }
  get fullname() {
    return this.#fullname
  }
  get contact_email() {
    return this.#contact_email
  }
  get contact_phone() {
    return this.#contact_phone
  }
  get location() {
    return this.#location
  }
  get services() {
    return this.#services
  }
  get about_you() {
    return this.#about_you
  }
  get experience() {
    return this.#experience
  }
  get hourly_rate() {
    return this.#hourly_rate
  }
  get about_experience() {
    return this.#about_experience
  }
  get skills() {
    return this.#skills
  }
  get isLoggedIn() {
    return this.#id !== undefined ? true : false
  }

  async login(email,password,role) {
    const data = JSON.stringify({email: email,password: password,role: role})
    const response = await fetch(BACKEND_URL + '/user/login',{
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: data
    })
    if (response.ok === true) {
      const json = await response.json()
      this.#id = json.id
      this.#email = json.email
      this.#role = json.role
      this.#token = json.token
      sessionStorage.setItem('user',JSON.stringify({
        ...json,            // id, email, role
        token: json.token    // đảm bảo có token
      }))
      return this
    } else {
      throw response.statusText
    }
  }

  async register(email,password,role) {
    const data = JSON.stringify({email: email,password: password,role: role})
    const response = await fetch(BACKEND_URL + '/user/register',{
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: data
    })
    if (response.ok === true) {
      const json = await response.json()
      this.#id = json.id
      this.#email = json.email
      this.#role = json.role
      sessionStorage.setItem('user',JSON.stringify(json))
      return this
    } else {
      throw response.statusText
    }
  }
  async updateProfile(fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills) {
    if (!this.isLoggedIn) {
      throw new Error("User must be logged in to update profile.")
    }
    const data = JSON.stringify({
      fullname: fullname,
      contact_email: contact_email,
      contact_phone: contact_phone,
      location: location,
      services: services,
      about_you: about_you,
      experience: experience,
      hourly_rate: hourly_rate,
      about_experience: about_experience,
      skills: skills
    })
    console.log('Bearer ' + this.#token);
    const response = await fetch(BACKEND_URL + '/user/profile', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.#token
      },
      body: data
    })
    if (response.ok === true) {
      const json = await response.json();
      this.#fullname = json.fullname
      this.#contact_email = json.contact_email
      this.#contact_phone = json.contact_phone  
      this.#location = json.location
      this.#services = json.services
      this.#about_you = json.about_you
      this.#experience = json.experience
      this.#hourly_rate = json.hourly_rate
      this.#about_experience = json.about_experience
      this.#skills = json.skills
      const updatedUser = { ...json, token: this.#token };
      sessionStorage.setItem('user', JSON.stringify(updatedUser))
      return this
    } else {
      throw response.statusText
    }
  }


  logout() {
    this.#id = undefined
    this.#email = undefined
    this.#token = undefined
    sessionStorage.removeItem('user')
  }

}

export { User }