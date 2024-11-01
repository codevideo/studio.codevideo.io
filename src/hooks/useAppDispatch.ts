import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/index'

export const useAppDispatch = () => useDispatch<AppDispatch>()
