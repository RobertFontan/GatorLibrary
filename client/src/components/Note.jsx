import React, {useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import { useSession } from "../components/SessionContext";
import supabase from "../config/supabaseClient";

function Note({title, videoID, data}) {
  const [notes, setNotes] = useState(data)
  const session = useSession()

  const handleSave = async () => {
    const {data, error} = await supabase
    .from('notes')
    .update({content: notes})
    .eq('videoId', videoID)
    .eq('profile_id', session.user.id)

    if(data){
      console.log('handlesave', data)
    }
    if(error){
      console.log('handleSaveErr', error)
    }
  } 



  return (
    <div className='note'>
      <h3>{title}</h3>
      <Button variant="dark" className="note-save" onClick={handleSave}>Save</Button>
      <textarea key={videoID} value={notes} rows='4' cols='50' onChange={(e) => setNotes(e.target.value)}/>
    </div>
  );
}

export default Note