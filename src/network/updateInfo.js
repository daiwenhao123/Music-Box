import {request} from './request.js'

export function updateInfo (gender,birthday,nickname,province,city,signature) {
	return request({
		url:'/user/update',
		params:{
			gender,
			birthday,
			nickname,
			province,
			city,
			signature
		}
	}) 
		
	
}