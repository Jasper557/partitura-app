import { SheetMusicItem } from '../types/index'
import { apiRequest, uploadFile } from '../config/api'

const STORAGE_BUCKET = 'sheet-music'

export const saveSheetMusic = async (userId: string, item: SheetMusicItem, pdfFile: File) => {
  try {
    // Create a FormData object to send the file and metadata
    const formData = new FormData()
    formData.append('pdfFile', pdfFile)
    formData.append('id', item.id)
    formData.append('title', item.title)
    formData.append('composer', item.composer)
    formData.append('isFavorite', String(item.isFavorite))
    formData.append('dateAdded', item.dateAdded.toISOString())
    
    // Upload to API
    const result = await uploadFile<{pdfPath: string}>(`/sheet-music/${userId}`, formData)
    
    return result.pdfPath
  } catch (error) {
    console.error('Error saving sheet music:', error)
    throw error
  }
}

export const getUserSheetMusic = async (userId: string): Promise<SheetMusicItem[]> => {
  try {
    console.log('Fetching sheet music for user:', userId)
    const data = await apiRequest<SheetMusicItem[]>(`/sheet-music/${userId}`)
    
    if (!data || data.length === 0) {
      console.log('No data found for user:', userId)
      return []
    }

    return data.map(item => ({
      ...item,
      dateAdded: new Date(item.dateAdded)
    }))
  } catch (error) {
    console.error('Error getting user sheet music:', error)
    throw error
  }
}

export const updateSheetMusic = async (
  userId: string, 
  itemId: string, 
  updates: Partial<SheetMusicItem>
) => {
  try {
    await apiRequest(`/sheet-music/${userId}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updates.title,
        composer: updates.composer,
        isFavorite: updates.isFavorite
      })
    })
  } catch (error) {
    console.error('Error updating sheet music:', error)
    throw error
  }
}

export const deleteSheetMusic = async (userId: string, itemId: string) => {
  try {
    await apiRequest(`/sheet-music/${userId}/${itemId}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Error deleting sheet music:', error)
    throw error
  }
}

export const fetchSheetMusic = async (userId: string): Promise<SheetMusicItem[]> => {
  try {
    const data = await apiRequest<SheetMusicItem[]>(`/sheet-music/${userId}`)
    
    return data.map(item => ({
      ...item,
      dateAdded: new Date(item.dateAdded)
    }))
  } catch (error) {
    console.error('Error fetching sheet music:', error)
    throw error
  }
} 