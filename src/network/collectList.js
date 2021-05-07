import {request} from './request.js'

export function collectList (t,id) {
	return request({
		url:'/playlist/subscribe',
		params:{
			t,
			id
		}
	})
}