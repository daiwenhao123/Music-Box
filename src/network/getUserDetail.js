import {request} from './request.js'

export function getUserDetail () {
	return request({
		url:'/user/account'
		
	})
}