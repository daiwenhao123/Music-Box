import {request} from './request.js'

export function getPhoneLogin(phone,password) {
	return request({
		url:'/login/cellphone',
		params:{
			phone,
			password
		}
	})
}

export function getPhoneLoginOut() {
	return request({
		url:'/logout'
	})
}