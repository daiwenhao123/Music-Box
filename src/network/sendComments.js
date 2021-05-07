import {request} from './request.js'

export function sendComments (t,type,id,content,commentId) {
	return request({
		url:'/comment',
		params:{
			t,
			type,
			id,
			content,
			commentId
		}
	})
}