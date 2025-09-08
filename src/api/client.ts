import { SeqUiServerService } from "@/api/services/seq-ui-server"
import Axios from 'axios'

export const getApi = () => {
	const axios = Axios.create({
		timeout: 59000,
		baseURL: import.meta.env.VITE_SEQ_UI_URL
	})

	return {
		seqUiServer: new SeqUiServerService(axios),
	}
}
