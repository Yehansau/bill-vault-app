import { View, TextInput, Image } from 'react-native'
import React from 'react'
import search from "@/assets/images/search.png"

const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-[#ECE6F0] rounded-full px-5 py-2 my-4">
      <Image source={search} className="size-5" resizeMode="contain"/>
      <TextInput placeholder="Search for a bill" value="" placeholderTextColor="#49454F" className="flex-1 ml-2 text-[14px]" />
    </View>
  )
}

export default SearchBar